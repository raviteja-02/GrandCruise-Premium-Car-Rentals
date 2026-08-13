import { Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { useMaintenance } from '../contexts/MaintenanceContext'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { isMaintenanceMode } = useMaintenance()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Cars', href: '/cars' },
    { name: 'Bookings', href: '/bookings' },
  ]

  const handleNavigation = (href: string) => {
    if (isMaintenanceMode && href === '/cars') {
      navigate('/maintenance')
    } else {
      navigate(href)
    }
  }

  return (
    <Disclosure as="nav" className="bg-primary">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link to="/" className="text-3xl font-greatvibes text-white">
                    Premium Car Rentals
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavigation(item.href)}
                        className="text-xl hover:bg-accent hover:text-white rounded-md px-3 py-2 text-sm font-playfair text-white"
                      >
                        {item.name}
                      </button>
                    ))}
                    {user?.is_staff && (
                      <Link
                        to="/admin"
                        className="text-xl hover:bg-accent hover:text-white rounded-md px-3 py-2 text-sm font-playfair text-white"
                      >
                        Admin
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {user ? (
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex max-w-xs items-center rounded-full bg-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
                          <UserCircleIcon className="h-8 w-8 text-neutral" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile"
                                className={classNames(
                                  active ? 'bg-neutral' : '',
                                  'block px-4 py-2 text-sm text-primary'
                                )}
                              >
                                Your Profile
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={logout}
                                className={classNames(
                                  active ? 'bg-neutral' : '',
                                  'block w-full text-left px-4 py-2 text-sm text-primary'
                                )}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <div className="space-x-4">
                      <Link
                        to="/login"
                        className="text-neutral hover:bg-accent hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="bg-accent text-white hover:bg-accent/80 rounded-md px-3 py-2 text-sm font-medium"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-primary p-2 text-neutral hover:bg-accent hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="button"
                  onClick={() => handleNavigation(item.href)}
                  className="text-neutral hover:bg-accent hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-accent pb-3 pt-4">
              {user ? (
                <div className="space-y-1">
                  <Disclosure.Button
                    as={Link}
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-neutral hover:bg-accent hover:text-white"
                  >
                    Your Profile
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-neutral hover:bg-accent hover:text-white"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Disclosure.Button
                    as={Link}
                    to="/login"
                    className="block px-4 py-2 text-base font-medium text-neutral hover:bg-accent hover:text-white"
                  >
                    Login
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    to="/register"
                    className="block px-4 py-2 text-base font-medium text-neutral hover:bg-accent hover:text-white"
                  >
                    Register
                  </Disclosure.Button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
} 