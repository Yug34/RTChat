import { Button } from './ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './ui/drawer'

interface PermissionDrawerProps {
  isPermissionGranted: boolean
}

const PermissionsDrawer = ({ isPermissionGranted }: PermissionDrawerProps) => {
  return (
    <Drawer open={!isPermissionGranted}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl text-red-500">⚠️ Missing Permissions</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter className="pt-0">
          <DrawerDescription className="text-lg">
            Please grant permissions to use your camera and microphone, and click on Refresh!
          </DrawerDescription>
          <Button onClick={() => window.location.reload()} className="cursor-pointer">
            Refresh
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default PermissionsDrawer
