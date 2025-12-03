import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ApperIcon } from "@/components";
import Header from "./Header";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'Home', current: location.pathname === '/' },
    { name: 'Students', href: '/students', icon: 'Users', current: location.pathname === '/students' },
    { name: 'Faculty', href: '/faculty', icon: 'UserCheck', current: location.pathname === '/faculty' },
    { name: 'Courses', href: '/courses', icon: 'Book', current: location.pathname === '/courses' },
    { name: 'Departments', href: '/departments', icon: 'Building', current: location.pathname === '/departments' },
    { name: 'Enrollment', href: '/enrollment', icon: 'UserPlus', current: location.pathname === '/enrollment' },
    { name: 'Attendance', href: '/attendance', icon: 'Calendar', current: location.pathname === '/attendance' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare', current: location.pathname === '/tasks' },
    { name: 'Deals', href: '/deals', icon: 'DollarSign', current: location.pathname === '/deals' },
    { name: 'Reports', href: '/reports', icon: 'BarChart3', current: location.pathname === '/reports' },
  ]

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-slate-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <ApperIcon name="X" className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="ml-3 text-xl font-semibold text-slate-800">College Hub</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-base font-medium rounded-md
                      ${item.current
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <ApperIcon
                      name={item.icon}
                      className={`
                        mr-4 flex-shrink-0 h-6 w-6
                        ${item.current ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-500'}
                      `}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-slate-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="ml-3 text-xl font-semibold text-slate-800">College Hub</span>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md
                      ${item.current
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <ApperIcon
                      name={item.icon}
                      className={`
                        mr-3 flex-shrink-0 h-6 w-6
                        ${item.current ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-500'}
                      `}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </button>
        </div>
        
        <Header />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

const Layout = () => {
  const location = useLocation()

const navigation = [
    { name: "Dashboard", path: "/", icon: "BarChart3" },
    { name: "Students", path: "/students", icon: "GraduationCap" },
    { name: "Faculty", path: "/faculty", icon: "Users" },
    { name: "Courses", path: "/courses", icon: "BookOpen" },
    { name: "Departments", path: "/departments", icon: "Building" },
    { name: "Enrollment", path: "/enrollment", icon: "UserPlus" },
    { name: "Attendance", path: "/attendance", icon: "UserCheck" },
    { name: "Tasks", path: "/tasks", icon: "CheckSquare" },
    { name: "Deals", path: "/deals", icon: "Handshake" },
    { name: "Reports", path: "/reports", icon: "FileText" }
  ]

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200 shadow-sm">
<div className="flex items-center flex-shrink-0 px-4 py-6 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-800">Shree College Hub</h1>
          </div>
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "text-primary-700 bg-primary-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.name}</span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeSidebarTab"
                      className="absolute inset-0 bg-primary-100 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-64">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
