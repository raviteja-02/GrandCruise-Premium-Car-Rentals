import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../../components/hooks/config'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    bookingConfirmationRequired: true,
    maxBookingsPerUser: 3,
    defaultBookingDuration: 24, // hours
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    // Load settings when component mounts
    const loadSettings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/settings/`)
        setSettings(response.data)
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
    loadSettings()
  }, [])

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleNumberChange = (key: keyof typeof settings, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveMessage('')
      
      await axios.post(`${API_BASE_URL}/admin/settings/`, settings)
      setSaveMessage('Settings saved successfully')
    } catch (error) {
      setSaveMessage('Failed to save settings')
      console.error('Error saving settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">System Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">System</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Maintenance Mode</h3>
              <p className="text-sm text-gray-600">Enable maintenance mode to restrict access</p>
            </div>
            <button
              onClick={() => handleToggle('maintenanceMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.maintenanceMode ? 'bg-primary' : 'bg-gray-200'
              }`}
              aria-label={`${settings.maintenanceMode ? 'Disable' : 'Enable'} maintenance mode`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Booking Confirmation</h3>
              <p className="text-sm text-gray-600">Require admin confirmation for bookings</p>
            </div>
            <button
              onClick={() => handleToggle('bookingConfirmationRequired')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.bookingConfirmationRequired ? 'bg-primary' : 'bg-gray-200'
              }`}
              aria-label={`${settings.bookingConfirmationRequired ? 'Disable' : 'Enable'} booking confirmation requirement`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.bookingConfirmationRequired ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        <div className="border-t pt-6 space-y-4">
          <h2 className="text-lg font-semibold">Booking Limits</h2>
          
          <div className="space-y-2">
            <label className="block">
              <span className="text-gray-700">Maximum Bookings Per User</span>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.maxBookingsPerUser}
                onChange={(e) => handleNumberChange('maxBookingsPerUser', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Default Booking Duration (hours)</span>
              <input
                type="number"
                min="1"
                max="72"
                value={settings.defaultBookingDuration}
                onChange={(e) => handleNumberChange('defaultBookingDuration', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </label>
          </div>
        </div>

        <div className="border-t pt-6 flex items-center justify-between">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {saveMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  )
} 