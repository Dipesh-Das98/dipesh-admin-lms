import { redirect } from 'next/navigation'

import { ContentLayout } from '@/components/dashboard-panel/content-layout'
import { DashboardHeader } from '@/components/dashboard-panel/dashboard-header'


import ThemeSettings from './components/theme-settings'
import { constructMetadata } from '@/lib/utils'
import { auth } from '@/auth'

export const metadata = constructMetadata({
  title: "Settings",
  description: "Manage your account settings.",
});
const SettingsPage = async () => {
  const session = await auth();
  if (!session?.user) {
    return redirect('/')
  }
  return (
    <ContentLayout>
      <DashboardHeader
        heading="Settings"
        text="Manage your account settings."
      />
      <div className="divide-y divide-muted  pb-10 max-w-7xl mx-auto">

        <ThemeSettings />
      </div>
    </ContentLayout>
  )

}

export default SettingsPage
