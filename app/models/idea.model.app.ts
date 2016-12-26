export class Idea {
    private _id: string;
    private _visibility: number; // 0: not published, 1: exclusive, 2: public
    private _title: string;
    private _picture: string; // picture URL
    private _description: string;
    private _background: string;
    private _problem: string;
    private _solution: string;
    private _extraLink: string;
    private _valueProposition: string;
    private _customerSegments: string;
    private _customerRelationships: string;
    private _channels: string;
    private _keyActivities: string;
    private _keyResources: string;
    private _keyPartners: string;
    private _costStructure: string;
    private _revenueStreams: string;
    private _strengths: string;
    private _weaknesses: string;
    private _opportunities: string;
    private _threats: string;
    private _category: string;
    private _lastChanged: Date;
    private _selected: boolean; // for selection in users list table

    constructor(id: string = "", info: any = {}, bmc: any = {}, swot: any = {},
        category: string = "",
        lastChanged: Date = new Date(0)) {

        this._id = id;
        this._visibility = info.visibility || 1;
        this._title = info.title || "";
        this._picture = info.picture || 
            "http://res.cloudinary.com/lighthauz-harbor/image/upload/v1479742560/default-idea-pic_wq1dzc.png";
        this._description = info.description || "";
        this._background = info.background || "";
        this._problem = info.problem || "";
        this._solution = info.solution || "";
        this._extraLink = info.extraLink || "";
        this._valueProposition = bmc.valueProposition || "";
        this._customerSegments = bmc.customerSegments || "";
        this._customerRelationships = bmc.customerRelationships || "";
        this._channels = bmc.channels || "";
        this._keyActivities = bmc.keyActivities || "";
        this._keyResources = bmc.keyResources || "";
        this._keyPartners = bmc.keyPartners || "";
        this._costStructure = bmc.costStructure || "";
        this._revenueStreams = bmc.revenueStreams || "";
        this._strengths = swot.strengths || "";
        this._weaknesses = swot.weaknesses || "";
        this._opportunities = swot.opportunities || "";
        this._threats = swot.threats || "";
        this._category = category;
        this._lastChanged = lastChanged;
        this._selected = false;
    }

    get id() {
        return this._id;
    }
    get visibility() {
        return this._visibility;
    }
    get title() {
        return this._title;
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
    get customerSegments() {
        return this._customerSegments;
    }
    get customerRelationships() {
        return this._customerRelationships;
    }
    get channels() {
        return this._channels;
    }
    get keyActivities() {
        return this._keyActivities;
    }
    get keyResources() {
        return this._keyResources;
    }
    get keyPartners() {
        return this._keyPartners;
    }
    get costStructure() {
        return this._costStructure;
    }
    get revenueStreams() {
        return this._revenueStreams;
    }
    get strengths() {
        return this._strengths;
    }
    get weaknesses() {
        return this._weaknesses;
    }
    get opportunities() {
        return this._opportunities;
    }
    get threats() {
        return this._threats;
    }
    get category() {
        return this._category;
    }
    get lastChanged() {
        return this._lastChanged;
    }
    get selected() {
        return this._selected;
    }

    set id(i: string) {
        this._id = i;
    }
    set visibility(v: number) {
        this._visibility = v;
    }
    set title(t: string) {
        this._title = t;
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
    set customerSegments(cs: string) {
        this._customerSegments = cs;
    }
    set customerRelationships(cr: string) {
        this._customerRelationships = cr;
    }
    set channels(ch: string) {
        this._channels = ch;
    }
    set keyActivities(ka: string) {
        this._keyActivities = ka;
    }
    set keyResources(kr: string) {
        this._keyResources = kr;
    }
    set keyPartners(kp: string) {
        this._keyPartners = kp;
    }
    set costStructure(cs: string) {
        this._costStructure = cs;
    }
    set revenueStreams(rs: string) {
        this._revenueStreams = rs;
    }
    set strengths(s: string) {
        this._strengths = s;
    }
    set weaknesses(w: string) {
        this._weaknesses = w;
    }
    set opportunities(o: string) {
        this._opportunities = o;
    }
    set threats(t: string) {
        this._threats = t;
    }
    set category(c: string) {
        this._category = c;
    }
    set lastChanged(lc: Date) {
        this._lastChanged = lc;
    }
    set selected(s: boolean) {
        this._selected = s;
    }
}