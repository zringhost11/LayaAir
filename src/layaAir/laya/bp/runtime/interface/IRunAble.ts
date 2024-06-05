import { IExcuteListInfo } from "../../core/interface/IExcuteListInfo";
import { IRuntimeDataManger } from "../../core/interface/IRuntimeDataManger";
import { TBPVarProperty } from "../../datas/types/BlueprintTypes";
import { RuntimeNodeData } from "../action/RuntimeNodeData";
import { BlueprintPinRuntime } from "../BlueprintPinRuntime";
import { BlueprintPromise } from "../BlueprintPromise";
import { BlueprintRuntimeBaseNode } from "../node/BlueprintRuntimeBaseNode";
import { IBPRutime } from "./IBPRutime";

export interface IRunAble {
    debuggerPause: boolean;

    readCache:boolean;

    pushBack(excuteNode: IExcuteListInfo,callback:any): void;

    readonly vars: { [key: string]: any };

    beginExcute(runtimeNode: BlueprintRuntimeBaseNode, runner: IBPRutime, enableDebugPause: boolean, fromPin: BlueprintPinRuntime, parmsArray: any[], prePin: BlueprintPinRuntime): BlueprintPromise;

    endExcute(runtimeNode: BlueprintRuntimeBaseNode): void;

    parmFromOtherPin(current: BlueprintPinRuntime,runtimeDataMgr:IRuntimeDataManger, from: BlueprintPinRuntime, parmsArray: any[],runId:number): void;

    parmFromSelf(current: BlueprintPinRuntime,runtimeDataMgr:IRuntimeDataManger, parmsArray: any[],runId:number): void;

    parmFromOutPut(outPutParmPins: BlueprintPinRuntime[],runtimeDataMgr:IRuntimeDataManger, parmsArray: any[]): void;

    parmFromCustom(parmsArray: any[], parm: any, parmname: string): void;

    excuteFun(nativeFun: Function, returnResult: BlueprintPinRuntime,runtimeDataMgr:IRuntimeDataManger, caller: any, parmsArray: any[],runId:number): any;

    getCode(): string;

    getVar(name: string): any;

    setVar(name: string, value: any): void;

    initVar(name: string, value: any): void;

    reCall(index: number): void;

    getSelf(): any;

    initData(key: number | symbol, nodeMap: Map<number, BlueprintRuntimeBaseNode>,localVarMap:Record<string, TBPVarProperty>,parentId?:number|symbol): void;

    getDataMangerByID(id:symbol|number):IRuntimeDataManger;

    setCacheAble(node: BlueprintRuntimeBaseNode, runId: number, value: any):void ;

    getCacheAble(node: BlueprintRuntimeBaseNode, runId: number):boolean;

    finish(runtime:IBPRutime):void;
}