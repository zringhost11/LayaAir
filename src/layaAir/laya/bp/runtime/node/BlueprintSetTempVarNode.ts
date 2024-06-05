import { TBPNode } from "../../datas/types/BlueprintTypes";
import { INodeManger } from "../../core/interface/INodeManger";

import { IRunAble } from "../interface/IRunAble";
import { BlueprintFunNode } from "./BlueprintFunNode";
import { BlueprintRuntimeBaseNode } from "./BlueprintRuntimeBaseNode";
import { IBPRutime } from "../interface/IBPRutime";
import { BlueprintUtil } from "../../core/BlueprintUtil";
import { BlueprintPinRuntime } from "../BlueprintPinRuntime";
import { IRuntimeDataManger } from "../../core/interface/IRuntimeDataManger";
import { BlueprintPromise } from "../BlueprintPromise";

export class BlueprintSetTempVarNode extends BlueprintFunNode {
    protected _varKey: string;
    constructor() {
        super();
    }

    protected onParseLinkData(node: TBPNode, manger: INodeManger<BlueprintRuntimeBaseNode>) {
        let cfg = manger.dataMap[node.dataId];
        this._varKey = cfg ? cfg.name : BlueprintUtil.getConstDataById(node.target, node.dataId).name;
    }

    step(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, fromExcute: boolean, runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime, prePin:BlueprintPinRuntime): BlueprintPinRuntime | BlueprintPromise {
        let _parmsArray: any[] = this.colloctParam(context, runtimeDataMgr, this.inPutParmPins, runner, runId, prePin);

        context.parmFromCustom(_parmsArray, this._varKey, '"' + this._varKey + '"');

        context.parmFromCustom(_parmsArray, runtimeDataMgr, "runtimeDataMgr");

        context.parmFromCustom(_parmsArray, runId, "runId");

        if (this.nativeFun) {
            context.excuteFun(this.nativeFun, this.returnValue, runtimeDataMgr, BlueprintFunNode, _parmsArray, runId);
        }
        return this.next();
    }
}