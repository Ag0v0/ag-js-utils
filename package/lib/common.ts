import dayjs from "dayjs";

/**
 * @desc  格式化时间
 * @param {(Date|String|number)} time
 * @param {String} format
 * @returns {String}
 */
export function formatDateTime(time: string | number | Date, format: string = "YYYY-MM-DD HH:mm:ss"): string {
  return dayjs(time).format(format);
}

export function formatDate(date: string | number | Date, format: string = "YYYY-MM-DD"): string {
  return formatDateTime(date, format);
}

/**
 * 延时
 * @param {number} delay 延时时长
 * @returns {Promise<void>}
 */
export function sleepFn(delay: number = 1000): Promise<void> {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}

/**
 * 新标签页预览图片或pdf
 * @param {"image" | "pdf"} type 文件类型 image|pdf
 * @param {String} dataUrl base64数据 data:image/jpeg;base64,xxxx|data:application/pdf;base64,xxxx
 * @param {String} title 标签名
 */
export function previewInNewTab(type: "image" | "pdf", dataUrl: string, title: string = "文件预览"): void {
  const newWin = window.open(dataUrl, "_blank", "width=1024,height=768,left=50,top=50");
  if (!newWin) return;

  if (type === "image") {
    const img = new Image();
    img.src = dataUrl;
    newWin.document.write(img.outerHTML);
  } else if (type === "pdf") {
    newWin.document.write('<iframe width="100%" height="100%" src=" ' + dataUrl + '" frameborder = "0" allowfullscreen />');
  }

  newWin.document.title = title;
  newWin.document.documentElement.style.width = "100%";
  newWin.document.documentElement.style.height = "100%";
  newWin.document.body.style.width = "100%";
  newWin.document.body.style.height = "100%";
  newWin.document.documentElement.style.margin = "0";
  newWin.document.body.style.margin = "0";
  newWin.document.close();
}

/**
 * 格式化文件大小
 * @param {Number} bit 字节数
 * @param {Number} fixed 保留的小数位
 * @returns {String}
 */
export function formatFileSize(bit: number, fixed: number = 2): string {
  if (!bit) {
    return "0 B";
  }
  const unitArr = new Array("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
  let index = 0;
  const srcsize = parseFloat(`${bit}`);
  index = Math.floor(Math.log(srcsize) / Math.log(1024));
  const size = (srcsize / Math.pow(1024, index)).toFixed(fixed);
  return size + unitArr[index];
}

/**
 * 构造树型结构数据
 * @param {{ [key: string]: any }[]} data 数据源
 * @param {String} id id字段 默认 'id'
 * @param {String} parentId 父节点字段 默认 'parentId'
 * @param {String} children 孩子节点字段 默认 'children'
 */
export function handleTree(data: { [key: string]: any }[], id?: string, parentId?: string, children?: string): { [key: string]: any }[] {
  let config = {
    id: id || "id",
    parentId: parentId || "parentId",
    childrenList: children || "children",
  };

  const childrenListMap: { [key: string]: any[] } = {};
  const nodeIds: { [key: string]: { [key: string]: any } } = {};
  const tree: { [key: string]: any }[] = [];

  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o: { [key: string]: any }) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
}

/**
 * 对象数据合并
 * @param {{ [x: string]: any }} source 对象1
 * @param {{ [x: string]: any }} target 对象2
 * @returns {{ [x: string]: any }}
 */
export function mergeRecursive(source: { [x: string]: any }, target: { [x: string]: any }): { [x: string]: any } {
  for (var p in target) {
    try {
      if (target[p].constructor == Object) {
        source[p] = mergeRecursive(source[p], target[p]);
      } else {
        source[p] = target[p];
      }
    } catch (e) {
      source[p] = target[p];
    }
  }
  return source;
}

/**
 * 模糊查询
 * @param {{ [key: string]: any }[]} list 数据列表
 * @param {String} val 查询值
 * @param {string[]} keys 可选字段
 * @returns {{ [key: string]: any }[]}
 */
export function fuzzyQuery(list: { [key: string]: any }[], val: string, keys?: string[]) {
  if (!val) return list;

  return list.filter((el) => {
    let obj: { [key: string]: any } = {};
    if (keys?.length) {
      keys.map((key) => el[key] && (obj[key] = el[key]));
    }
    return Object.values(obj).some((e) => new RegExp(val + "", "i").test(e));
  });
}

/**
 * 将数字补全为指定位数
 * @param {Number} num 原始数值
 * @param {Number} digits 位数
 * @returns {String}
 */
export function completeDigit(num: number, digits: number = 2) {
  let formattedNum = num.toString();
  while (formattedNum.length < digits) {
    formattedNum = "0" + formattedNum;
  }
  return formattedNum;
}

/**
 * arraybuff 转 base64
 * @param {Iterable<number>} buffer
 * @returns {String}
 */
export function bufferToBase64(buffer: Iterable<number>): string {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  for (var len = bytes.byteLength, i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * 生成 Formdata
 * @param data 源数据
 * @returns FormData
 */
export function createFormdata(data: Record<string, any> = {}): FormData {
  const form = new FormData();
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      form.append(key, data[key]);
    }
  }
  return form;
}

/**
 * arraybuff 转 base64
 * @param buffer
 * @returns
 */
export function arrayBufferToBase64(buffer: Iterable<number>): string {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  for (var len = bytes.byteLength, i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
