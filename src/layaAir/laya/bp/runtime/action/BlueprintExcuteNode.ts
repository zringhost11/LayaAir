import { IRunAble } from "../interface/IRunAble";
import { BlueprintPinRuntime } from "../BlueprintPinRuntime";
import { BlueprintRuntimeBaseNode } from "../node/BlueprintRuntimeBaseNode";
import { BlueprintRunBase } from "./BlueprintRunBase";
import { IBPRutime } from "../interface/IBPRutime";
import { RuntimeNodeData, RuntimePinData } from "./RuntimeNodeData";
import { IExcuteListInfo } from "../../core/interface/IExcuteListInfo";
import { BlueprintFactory } from "../BlueprintFactory";
import { IRuntimeDataManger } from "../../core/interface/IRuntimeDataManger";
import { BlueprintPromise } from "../BlueprintPromise";
import { TBPVarProperty } from "../../datas/types/BlueprintTypes";
import { EPinType } from "../../core/EBluePrint";

export class BlueprintExcuteNode extends BlueprintRunBase implements IRunAble {
    owner: any;
    varDefineMap: Map<string, boolean>;
    runtimeDataMgrMap: Map<number | symbol, RuntimeDataManger>;
    readCache: boolean;

    private _cacheMap: Map<number, Map<number, boolean>> = new Map();

    setCacheAble(node: BlueprintRuntimeBaseNode, runId: number, value: any): void {
        let map = this._cacheMap.get(node.nid);
        if (!map) {
            map = new Map();
            this._cacheMap.set(node.nid, map);
        }
        map.set(runId, value);
    }

    getCacheAble(node: BlueprintRuntimeBaseNode, runId: number): boolean {
        return this._cacheMap.get(node.nid)?.get(runId);
    }

    constructor(data: any) {
        super();
        this.owner = data;
        this.varDefineMap = new Map;
        this.runtimeDataMgrMap = new Map;
    }
    finish(runtime: IBPRutime): void {
        //console.log(runtime.name+ "finish");
    }
    getDataMangerByID(id: number | symbol): IRuntimeDataManger {
        return this.runtimeDataMgrMap.get(id);
    }

    initData(key: number | symbol, nodeMap: Map<number, BlueprintRuntimeBaseNode>, localVarMap: Record<string, TBPVarProperty>, parentId?: number | symbol): void {
        let runtimeDataMgr = this.runtimeDataMgrMap.get(key);
        if (!runtimeDataMgr) {
            let parent = this.runtimeDataMgrMap.get(parentId);
            if (parent) {
                runtimeDataMgr = parent;
            }
            else {
                runtimeDataMgr = new RuntimeDataManger(key);
                runtimeDataMgr.initData(nodeMap, localVarMap);
            }
            this.runtimeDataMgrMap.set(key, runtimeDataMgr);
        }
    }
    debuggerPause: boolean;
    pushBack(excuteNode: IExcuteListInfo, callback: any): void {
        debugger;
        //throw new Error("Method not implemented.");
    }
    getSelf() {
        return this.owner;
    }

    initVar(name: string, value: any): void {
        this.vars[name] = value;
        this.varDefineMap.set(name, true);
    }

    setVar(name: string, value: any) {
        let obj = this.varDefineMap.get(name) ? this.vars : this.owner;
        obj[name] = value;
    }
    getVar(name: string) {
        let obj = this.varDefineMap.get(name) ? this.vars : this.owner;
        return obj[name];
    }
    getCode(): string {
        return "";
    }
    beginExcute(runtimeNode: BlueprintRuntimeBaseNode, runner: IBPRutime, enableDebugPause: boolean, fromPin: BlueprintPinRuntime, parmsArray: any[], prePin: BlueprintPinRuntime): BlueprintPromise {
        //throw new Error("Method not implemented.");
        if (this.listNode.indexOf(runtimeNode) == -1) {
            this.listNode.push(runtimeNode);
            //super.beginExcute(runtimeNode);
            // this.currentFun=[];
            return null;
        }
        else {
            return null;
        }

    }
    endExcute(runtimeNode: BlueprintRuntimeBaseNode): void {
        //throw new Error("Method not implemented.");
    }
    parmFromCustom(parmsArray: any[], parm: any, parmname: string): void {
        parmsArray.push(parm);
    }

    vars: { [key: string]: any; } = {};

    parmFromOtherPin(current: BlueprintPinRuntime, runtimeDataMgr: IRuntimeDataManger, from: BlueprintPinRuntime, parmsArray: any[], runId: number): void {
        parmsArray.push(runtimeDataMgr.getPinData(from, runId));
    }

    parmFromSelf(current: BlueprintPinRuntime, runtimeDataMgr: IRuntimeDataManger, parmsArray: any[], runId: number): void {
        parmsArray.push(runtimeDataMgr.getPinData(current, runId));
    }

    parmFromOutPut(outPutParmPins: BlueprintPinRuntime[], runtimeDataMgr: IRuntimeDataManger, parmsArray: any[]): void {
        for (let i = 0, n = outPutParmPins.length; i < n; i++) {
            let out = outPutParmPins[i];
            parmsArray.push(runtimeDataMgr.getRuntimePinById(out.id));
        }
    }

    excuteFun(nativeFun: Function, returnResult: BlueprintPinRuntime, runtimeDataMgr: IRuntimeDataManger, caller: any, parmsArray: any[], runId: number): any {
        let result = nativeFun.apply(caller, parmsArray);
        //if (result != undefined && !(result instanceof Promise)) {
        returnResult && runtimeDataMgr.setPinData(returnResult, result, runId);
        //outPutParmPins[0].setValue(result);
        //}
        return result;
    }

    reCall(index: number): void {

    }

}

class RuntimeDataManger implements IRuntimeDataManger {
    id: symbol | number;

    isInit: boolean;
    /**
    * 节点数据区Map
    */
    nodeMap: Map<number, RuntimeNodeData>;
    /**
     * 引脚数据Map
     */
    pinMap: Map<string, RuntimePinData>;

    parmsArray: RuntimePinData[];

    localVarObj: any;

    localVarMap: Map<number, any>;

    constructor(id: symbol | number) {
        this.id = id;
        this.localVarObj = {};
        this.localVarMap = new Map();
        this.parmsArray = [];
    }

    saveContextData(from: number, to: number): void {
        this.parmsArray.forEach((value) => {
            value.copyValue(from, to);
        });
        let a = this.localVarMap.get(from);
        if (a) {
            this.localVarMap.set(to, Object.create(a));
        }
    }


    private _initGetVarObj(runId: number) {
        let a = this.localVarMap.get(runId);
        if (!a) {
            a = Object.create(this.localVarObj);
            this.localVarMap.set(runId, a);
        }
        return a;
    }
    clearVar(runId: number): void {
        this.localVarMap.delete(runId);
    }

    getVar(name: string, runId: number) {
        let varObj = this._initGetVarObj(runId);
        return varObj[name];
    }
    setVar(name: string, value: any, runId: number): void {
        let varObj = this._initGetVarObj(runId);
        return varObj[name] = value;
    }

    getDataById(nid: number): RuntimeNodeData {
        return this.nodeMap.get(nid);
    }

    getRuntimePinById(id: string): RuntimePinData {
        return this.pinMap.get(id);
    }

    setPinData(pin: BlueprintPinRuntime, value: any, runId: number): void {
        this.pinMap.get(pin.id).setValue(runId, value);
    }

    getPinData(pin: BlueprintPinRuntime, runId: number) {
        return this.pinMap.get(pin.id).getValue(runId);
    }


    initData(nodeMap: Map<number, BlueprintRuntimeBaseNode>, localVarMap: Record<string, TBPVarProperty>): void {
        if (!this.isInit) {
            if (!this.nodeMap) {
                this.nodeMap = new Map()
            }
            if (!this.pinMap) {
                this.pinMap = new Map();
            }
            let dataMap = this.nodeMap;
            let pinMap = this.pinMap;
            nodeMap.forEach((value, key) => {
                if (dataMap.get(key)) {
                    return;
                }
                let cls = BlueprintFactory.getBPContextData(value.type);
                let rdata = new cls();
                dataMap.set(key, rdata);
                value.pins.forEach(pin => {
                    let pinData = new RuntimePinData();
                    pinData.name = pin.name;
                    if (pin.value != undefined && pin.linkTo.length == 0) {
                        pinData.initValue(pin.value);
                    }

                    if (pinMap.get(pin.id)) {
                        debugger;
                    }
                    pinMap.set(pin.id, pinData);
                    if (pin.type != EPinType.Exec) {
                        this.parmsArray.push(pinData);
                    }
                })
            })
            if (localVarMap) {
                for (let key in localVarMap) {
                    this.localVarObj[localVarMap[key].name] = localVarMap[key].value;
                }
            }
            this.isInit = true;
        }
    }

}