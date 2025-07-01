import useChatStore from '@/store/core'
import { Button } from './ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './ui/drawer'

const PermissionsDrawer = () => {
  const { isPermissionGranted } = useChatStore()

  return (
    <Drawer open={!isPermissionGranted}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl text-red-500">⚠️ Missing Permissions</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter className="pt-0">
          <DrawerDescription className="text-md">
            Please grant permissions to use your camera and microphone, and click on the{' '}
            <strong>Refresh</strong> button!
          </DrawerDescription>
          <Button onClick={() => window.location.reload()} className="mt-2 cursor-pointer">
            Refresh
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default PermissionsDrawer
