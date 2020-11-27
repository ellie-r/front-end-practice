var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var jobsList = document.querySelector('.jobsList');
var filtersList = document.querySelector('.filters');
function getJobs() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, fetch('data.json')];
                case 1:
                    data = _a.sent();
                    return [2, data.json()];
            }
        });
    });
}
function getHandlebarTemplate(path) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, fetch(path, { method: 'get' })];
                case 1:
                    response = _a.sent();
                    return [2, response.text()];
            }
        });
    });
}
var currentFilters = [];
function populatePage(currentFilters) {
    return __awaiter(this, void 0, void 0, function () {
        var dataToInsert, HBTemplate, template, selectFilters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jobsList.innerHTML = '';
                    return [4, getJobs()];
                case 1:
                    dataToInsert = _a.sent();
                    return [4, getHandlebarTemplate('js/templates/job.hbs')];
                case 2:
                    HBTemplate = _a.sent();
                    template = Handlebars.compile(HBTemplate);
                    dataToInsert.forEach(function (job) {
                        var jobsPartsToCheck = JSON.parse(JSON.stringify(job.languages));
                        jobsPartsToCheck.push(job.level);
                        jobsPartsToCheck.push(job.role);
                        if (currentFilters.length > 0) {
                            if (jobsPartsToCheck.some(function (part) { return currentFilters.includes(part); })) {
                                jobsList.innerHTML += template(job);
                            }
                        }
                        else {
                            jobsList.innerHTML += template(job);
                        }
                    });
                    selectFilters = document.querySelectorAll('.toFilter');
                    console.log(selectFilters);
                    selectFilters.forEach(function (filter) {
                        filter.addEventListener('click', addFilter);
                    });
                    return [2];
            }
        });
    });
}
function addFilter(e) {
    return __awaiter(this, void 0, void 0, function () {
        var FilterTemplate, template, filtersBox;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getHandlebarTemplate('js/templates/filterOn.hbs')];
                case 1:
                    FilterTemplate = _a.sent();
                    template = Handlebars.compile(FilterTemplate);
                    filtersBox = document.querySelector('.filters');
                    console.log(filtersBox.style.display);
                    if (!filtersBox.style.display) {
                        filtersBox.style.display = 'flex';
                    }
                    filtersList.innerHTML += template({ filter: e.target.textContent });
                    currentFilters.push(e.target.textContent.toString());
                    populatePage(currentFilters);
                    return [2];
            }
        });
    });
}
populatePage(currentFilters);
