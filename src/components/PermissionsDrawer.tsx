import { Button } from './ui/button'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from './ui/drawer'

interface PermissionDrawerProps {
  isPermissionGranted: boolean
}

const PermissionsDrawer = ({ isPermissionGranted }: PermissionDrawerProps) => {
  return (
    <Drawer open={!isPermissionGranted}>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Please grant permission to use your camera and microphone, and click on Refresh!</DrawerTitle>
      </DrawerHeader>
      <DrawerFooter>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
  )
}

export default PermissionsDrawer