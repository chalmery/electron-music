import {openDirAction} from "./action/openDirAction";
import {localSettingAction} from "./action/localSettingAction";
import {dataSyncAction} from "./action/dataSyncAction";
import {localDataAction} from "./action/localDataAction";

const listen = () => {
    //settings
    openDirAction()

    localSettingAction()

    dataSyncAction()

    localDataAction()
}


export {
    listen
}