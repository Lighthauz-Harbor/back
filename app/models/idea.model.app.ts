export class Idea {
    private _visibility: number;
    private _name: string;
    private _picture: string;
    private _description: string;
    private _background: string;
    private _problem: string;
    private _solution: string;
    private _extraLink: string;
    private _valueProposition: string;
    private _customerSegment: string;
    private _customerRelationship: string;
    private _channel: string;
    private _keyActivities: string;
    private _keyResources: string;
    private _keyPartner: string;
    private _costStructure: string;
    private _revenueStream: string;
    private _strength: string;
    private _weakness: string;
    private _opportunities: string;
    private _threat: string;
    private _author: string;
    private _category: string;

    constructor(info: any = {}, bmc: any = {}, swot: any = {}, 
        author: string = "Unknown author", 
        category: string = "Unknown category") {

        this._visibility = info.visibility || 1; // 1: public, 2: exclusive
        this._name = info.name || "";
        this._picture = info.picture || ""; // picture URL
        this._description = info.description || "";
        this._background = info.background || "";
        this._problem = info.problem || "";
        this._solution = info.solution || "";
        this._extraLink = info.extraLink || "";
        this._valueProposition = bmc.valueProposition || "";
        this._customerSegment = bmc.customerSegment || "";
        this._customerRelationship = bmc.customerRelationship || "";
        this._channel = bmc.channel || "";
        this._keyActivities = bmc.keyActivities || "";
        this._keyResources = bmc.keyResources || "";
        this._keyPartner = bmc.keyPartner || "";
        this._costStructure = bmc.costStructure || "";
        this._revenueStream = bmc.revenueStream || "";
        this._strength = swot.strength || "";
        this._weakness = swot.weakness || "";
        this._opportunities = swot.opportunities || "";
        this._threat = swot.threat || "";
        this._author = author;
        this._category = category;
    }

    get visibility() {
        return this._visibility;
    }
    get name() {
        return this._name;
    }
    get picture() {
        return this._picture;
    }
    get description() {
        return this._description;
    }
    get background() {
        return this._background;
    }
    get problem() {
        return this._problem;
    }
    get solution() {
        return this._solution;
    }
    get extraLink() {
        return this._extraLink;
    }
    get valueProposition() {
        return this._valueProposition;
    }
    get customerSegment() {
        return this._customerSegment;
    }
    get customerRelationship() {
        return this._customerRelationship;
    }
    get channel() {
        return this._channel;
    }
    get keyActivities() {
        return this._keyActivities;
    }
    get keyResources() {
        return this._keyResources;
    }
    get keyPartner() {
        return this._keyPartner;
    }
    get costStructure() {
        return this._costStructure;
    }
    get revenueStream() {
        return this._revenueStream;
    }
    get strength() {
        return this._strength;
    }
    get weakness() {
        return this._weakness;
    }
    get opportunities() {
        return this._opportunities;
    }
    get threat() {
        return this._threat;
    }
    get author() {
        return this._author;
    }
    get category() {
        return this._category;
    }

    set visibility(v: number) {
        this._visibility = v;
    }
    set name(n: string) {
        this._name = n;
    }
    set picture(p: string) {
        this._picture = p;
    }
    set description(d: string) {
        this._description = d;
    }
    set background(b: string) {
        this._background = b;
    }
    set problem(p: string) {
        this._problem = p;
    }
    set solution(s: string) {
        this._solution = s;
    }
    set extraLink(el: string) {
        this._extraLink = el;
    }
    set valueProposition(vp: string) {
        this._valueProposition = vp;
    }
    set customerSegment(cs: string) {
        this._customerSegment = cs;
    }
    set customerRelationship(cr: string) {
        this._customerRelationship = cr;
    }
    set channel(ch: string) {
        this._channel = ch;
    }
    set keyActivities(ka: string) {
        this._keyActivities = ka;
    }
    set keyResources(kr: string) {
        this._keyResources = kr;
    }
    set keyPartner(kp: string) {
        this._keyPartner = kp;
    }
    set costStructure(cs: string) {
        this._costStructure = cs;
    }
    set revenueStream(rs: string) {
        this._revenueStream = rs;
    }
    set strength(s: string) {
        this._strength = s;
    }
    set weakness(w: string) {
        this._weakness = w;
    }
    set opportunities(o: string) {
        this._opportunities = o;
    }
    set threat(t: string) {
        this._threat = t;
    }
    set author(a: string) {
        this._author = a;
    }
    set category(c: string) {
        this._category = c;
    }
}