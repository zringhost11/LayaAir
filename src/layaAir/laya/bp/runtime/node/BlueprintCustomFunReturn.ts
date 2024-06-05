import { BlueprintPin } from "../../core/BlueprintPin";
import { EPinDirection, EPinType } from "../../core/EBluePrint";
import { IOutParm } from "../../core/interface/IOutParm";
import { IRuntimeDataManger } from "../../core/interface/IRuntimeDataManger";
import { RuntimeNodeData } from "../action/RuntimeNodeData";
import { BlueprintPinRuntime } from "../BlueprintPinRuntime";
import { BlueprintPromise } from "../BlueprintPromise";
import { BlueprintStaticFun } from "../BlueprintStaticFun";
import { IBPRutime } from "../interface/IBPRutime";
import { IRunAble } from "../interface/IRunAble";
import { BlueprintRuntimeBaseNode } from "./BlueprintRuntimeBaseNode";

export class BlueprintCustomFunReturn extends BlueprintRuntimeBaseNode {
    /**
     * 输入引脚
     */
    inExcutes: BlueprintPinRuntime[];
    constructor() {
        super();
        this.inExcutes = [];
    }

    step(context: IRunAble, runtimeDataMgr: IRuntimeDataManger, fromExcute: boolean, runner: IBPRutime, enableDebugPause: boolean, runId: number, fromPin: BlueprintPinRuntime, prePin: BlueprintPinRuntime): BlueprintPinRuntime | BlueprintPromise | number {
        let result = super.step(context, runtimeDataMgr, fromExcute, runner, enableDebugPause, runId, fromPin, prePin);
        let nodeContext = runtimeDataMgr.getDataById(this.nid) as BlueprintCustomFunReturnContext;
        let index = this.inExcutes.indexOf(fromPin);
        if (index == 0) {//是否是函数结束
            let curRunId = nodeContext.runIdMap.get(runId);
            nodeContext.returnResult(runId, curRunId);
        }
        else {
            //let curRunId = nodeContext.runIdMap.get(runId);
            nodeContext.returnResult(runId, runId);
            nodeContext.runExcute(runId, index, context);
            return 1;
        }
        return null;
    }

    initData(runtimeDataMgr: IRuntimeDataManger, curRunId: number, runId: number, parms: any[], offset: number, outExcutes: BlueprintPinRuntime[], runner: IBPRutime, oldRuntimeDataMgr: IRuntimeDataManger) {
        let data = runtimeDataMgr.getDataById(this.nid) as BlueprintCustomFunReturnContext;
        data.initData(curRunId, runId, parms, offset, outExcutes, runner, oldRuntimeDataMgr);
    }

    addPin(pin: BlueprintPinRuntime): void {
        super.addPin(pin);
        if (pin.type == EPinType.Exec) {
            if (pin.direction == EPinDirection.Input) {
                this.inExcutes.push(pin);
            }
        }
    }


}

export class BlueprintCustomFunReturnContext extends RuntimeNodeData {
    returnMap: Map<number, IOutParm[]>
    runIdMap: Map<number, number>;
    outExcutesMap: Map<number, BlueprintPinRuntime[]>;

    runnerMap: Map<number, [IBPRutime, IRuntimeDataManger]>;


    constructor() {
        super();
        this.returnMap = new Map();
        this.runIdMap = new Map();
        this.outExcutesMap = new Map();
        this.runnerMap = new Map();
    }

    initData(curRunId: number, runId: number, parms: any[], offset: number, outExcutes: BlueprintPinRuntime[], runner: IBPRutime, runtimeDataMgr: IRuntimeDataManger) {
        let result: any[] = [];
        this.returnMap.set(curRunId, result);
        this.runIdMap.set(curRunId, runId);
        this.outExcutesMap.set(curRunId, outExcutes);
        this.runnerMap.set(curRunId, [runner, runtimeDataMgr]);
        for (let i = offset; i < parms.length; i++) {
            result.push(parms[i]);
        }
    }

    runExcute(runId: number, index: number, context: IRunAble) {
        let outExcutes = this.outExcutesMap.get(runId);
        if (outExcutes) {
            let outExcute = outExcutes[index];
            if (outExcute) {
                let nextPin = outExcute.linkTo[0] as BlueprintPinRuntime;
                if (nextPin) {
                    let runner = this.runnerMap.get(runId);
                    runner[0].runByContext(context, runner[1], nextPin.owner, true, null, runId, nextPin, outExcute);
                }
            }
        }
    }

    returnResult(runId: number, curRunId: number) {
        let result = this.returnMap.get(runId);
        if (result) {
            result.forEach((parm, index) => {
                parm.setValue(curRunId, this.getParamsArray(runId)[index]);
            })
        }
    }
}