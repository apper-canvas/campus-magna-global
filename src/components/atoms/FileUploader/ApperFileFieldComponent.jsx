import React, { useState, useEffect, useRef, useMemo } from 'react';

const ApperFileFieldComponent = ({ elementId, config }) => {
  // State for UI-driven values
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Refs for tracking lifecycle and preventing memory leaks
  const mountedRef = useRef(false);
  const elementIdRef = useRef(elementId);
  const existingFilesRef = useRef([]);

  // Update elementId ref when it changes
  useEffect(() => {
    elementIdRef.current = elementId;
  }, [elementId]);

  // Memoized existing files to prevent unnecessary re-renders
  const memoizedExistingFiles = useMemo(() => {
    if (!config.existingFiles || !Array.isArray(config.existingFiles)) {
      return [];
    }
    
    // Return empty array if no files
    if (config.existingFiles.length === 0) {
      return [];
    }
    
    // Check if files have changed by comparing length and first file's ID
    const currentFiles = config.existingFiles;
    const previousFiles = existingFilesRef.current;
    
    if (currentFiles.length !== previousFiles.length) {
      return currentFiles;
    }
    
    if (currentFiles.length > 0 && previousFiles.length > 0) {
      // Compare first file's ID (handle both Id and id properties)
      const currentFirstId = currentFiles[0].Id || currentFiles[0].id;
      const previousFirstId = previousFiles[0].Id || previousFiles[0].id;
      
      if (currentFirstId !== previousFirstId) {
        return currentFiles;
      }
    }
    
    return previousFiles;
  }, [config.existingFiles]);

  // Initial mount effect
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50;
    
    const initializeSDK = async () => {
      // Wait for ApperSDK to load
      while (attempts < maxAttempts && !window.ApperSDK) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!window.ApperSDK) {
        setError('ApperSDK not loaded. Please ensure the SDK script is included before this component.');
        return;
      }

      try {
        const { ApperFileUploader } = window.ApperSDK;
        elementIdRef.current = `file-uploader-${elementId}`;
        
        await ApperFileUploader.FileField.mount(elementIdRef.current, {
          ...config,
          existingFiles: memoizedExistingFiles
        });
        
        mountedRef.current = true;
        setIsReady(true);
        existingFilesRef.current = memoizedExistingFiles;
      } catch (error) {
        console.error('Error mounting file field:', error);
        setError('Failed to initialize file uploader');
      }
    };

    initializeSDK();

    // Cleanup on component destruction
    return () => {
      try {
        if (mountedRef.current && window.ApperSDK) {
          const { ApperFileUploader } = window.ApperSDK;
          ApperFileUploader.FileField.unmount(elementIdRef.current);
        }
        mountedRef.current = false;
        existingFilesRef.current = [];
      } catch (error) {
        console.error('Error unmounting file field:', error);
      }
    };
  }, [elementId, config.fieldKey]);

  // File update effect
  useEffect(() => {
    // Early returns
    if (!isReady || !window.ApperSDK || !config.fieldKey) return;

    // Deep equality check
    const currentFilesJson = JSON.stringify(memoizedExistingFiles);
    const previousFilesJson = JSON.stringify(existingFilesRef.current);
    
    if (currentFilesJson === previousFilesJson) return;

    try {
      const { ApperFileUploader } = window.ApperSDK;
      
      // Format detection - check for .Id vs .id property
      let filesToUpdate = memoizedExistingFiles;
      if (filesToUpdate.length > 0 && filesToUpdate[0].Id !== undefined) {
        // Convert from API format to UI format
        filesToUpdate = ApperFileUploader.toUIFormat(memoizedExistingFiles);
      }
      
      // Conditional update or clear
      if (filesToUpdate.length > 0) {
        ApperFileUploader.FileField.updateFiles(config.fieldKey, filesToUpdate);
      } else {
        ApperFileUploader.FileField.clearField(config.fieldKey);
      }
      
      existingFilesRef.current = memoizedExistingFiles;
    } catch (error) {
      console.error('Error updating files:', error);
      setError('Failed to update files');
    }
  }, [memoizedExistingFiles, isReady, config.fieldKey]);

  // Error UI
  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Main container - SDK takes over when mounted */}
      <div id={`file-uploader-${elementId}`} className="w-full" />
      
      {/* Loading UI */}
      {!isReady && (
        <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading file uploader...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApperFileFieldComponent;