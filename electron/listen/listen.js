import {openDirAction} from "./action/openDirAction";
import {localSettingAction} from "./action/localSettingAction";
import {dataSyncAction} from "./action/dataSyncAction";
import {localDataAction} from "./action/localDataAction";
import {LrcAction} from "./action/LrcAction";
import { installLrc } from "./action/installLrc";

/**
 * 注册全部的监听事件
 */
const listen = () => {
    openDirAction()

    localSettingAction()

    dataSyncAction()

    localDataAction()

    LrcAction()

    installLrc()
}


export {
    listen
}