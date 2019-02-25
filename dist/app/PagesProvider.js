"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ramda = _interopRequireDefault(require("ramda"));

var utility = _interopRequireWildcard(require("./utility"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This class is used to provide a set of pages extracted from filesystem.
 * The set of pages is cut by environment
 */
class PagesProvider {
  constructor(configuration = {}) {
    this._baseFile = configuration.baseFile ? configuration.baseFile : 'pages.json';
    this._absoluteFile = _path.default.join(process.cwd(), this._baseFile);
  }
  /**
   * Loads page as state of object from filesystem 
   */


  loadPages() {
    this._pages = utility.getJSONFromFile(this._absoluteFile);
  }
  /**
   * Works a set of page for the context
   * 
   * @param {String} context identifier of the ernviroment ot use
   * @param {Function} worker function to work pages
   */


  worksOnPages(context = 'default', worker) {
    if (!_ramda.default.isEmpty(this._pages) && worker) {
      const pagesSet = utility.getClonedProp(context, this._pages);

      if (_ramda.default.length(pagesSet) > 0) {
        _ramda.default.call(worker, _ramda.default.clone(pagesSet));
      }
    }
  }
  /**
   * Gets the whole set of pages
   */


  get pages() {
    return { ...this._pages
    };
  }

}

var _default = PagesProvider;
exports.default = _default;