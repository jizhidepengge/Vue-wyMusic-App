import 'muse-ui/lib/styles/base.less'
import { AppBar, BottomSheet, Button, Carousel, Divider, Drawer, Icon, List, Progress, Snackbar, SubHeader, Tabs } from 'muse-ui'
import 'muse-ui/lib/styles/theme.less'

const components = [AppBar, BottomSheet, Button, Carousel, Divider, Drawer, Icon, List, Progress, Snackbar, SubHeader, Tabs]

export default {
  install(Vue) {
    components.forEach(c => Vue.use(c))
  }
}
