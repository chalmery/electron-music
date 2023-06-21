import {listType, playModeEnum} from "@/enums/enums";
import {listLoop, random, singleLoop} from "@/strategy/playMode";
import {localListLoop, loveListLoop, playListListLoop} from "@/strategy/listLoop";


const playModeRepository = new Map();
playModeRepository.set(playModeEnum.SINGLE_LOOP, singleLoop)
playModeRepository.set(playModeEnum.LIST_LOOP, listLoop)
playModeRepository.set(playModeEnum.RANDOM, random)


const listLoopRepository = new Map();
listLoopRepository.set(listType.LocalListLoop, localListLoop)
listLoopRepository.set(listType.LoveListLoop, loveListLoop)
listLoopRepository.set(listType.PlayListListLoop, playListListLoop)


export {playModeRepository, listLoopRepository}