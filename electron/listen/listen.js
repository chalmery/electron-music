import {openDirAction} from "./action/openDirAction";
import {localSettingAction} from "./action/localSettingAction";
import {dataSyncAction} from "./action/dataSyncAction";
import {localDataAction} from "./action/localDataAction";
import {LrcAction} from "./action/LrcAction";

const listen = () => {
    openDirAction()

    localSettingAction()

    dataSyncAction()

    localDataAction()

    LrcAction()
}


export {
    listen
}