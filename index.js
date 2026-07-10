const fs = require('fs/promises');
const { json } = require('stream/consumers');

// ========== 任務一：讀取會員清單 ==========
/**
 * 讀取指定路徑的 JSON 檔案，回傳解析後的會員陣列。
 *
 * @param {string} filePath - 會員 JSON 檔案的路徑（相對或絕對都可以）
 * @returns {Promise<Array<Object>>} 會員物件陣列
 *
 * @example
 *   const members = await readMembers('./fixtures/members.json');
 *   console.log(members[0].name); // '小華'
 */
async function readMembers(filePath) {
  // TODO: 實作此函式
  // 提示：用 fs/promises 的 readFile，記得加 'utf-8'，再用 JSON.parse 轉成物件
  try{
    /*
    * fs.readFile本身回傳Promise >>> Promise<string>
    * await等待Promise完成，取得Promise成功回傳的值: Promise<string> --await--> string
    * 如果要在函式內使用 await，這個函式必須宣告為 async
    * Promise 是一個物件（Object），代表一個非同步工作的最終結果。
    */
    //-----------------------------------------------------------------------------------
    /*比較
    * 1.無await(外送員正在路上保證你會收到):
    * const fileContent = fs.readFile(...);
    * >>> fileContent: Promise<string> (Promise物件)
    * 2.有await(等待Promise完成，取得真正的資料):
    * const filecontent = await fs.readFile(...);
    * >>> fileContent: string
    //----------------------------------------------------------------------------------
    /*
    * filecontent回傳的是字串(String)
    * ex: "[{"name":"小華"},{"name":"小美"}]"
    */
    const fileContent = await fs.readFile(filePath,'utf-8');
    /*
    * 將 JSON 字串(String)解析成 JavaScript 陣列(Array)
    * ex:
    * [
    *   {name: "小華" },
    *   {name: "小美" }
    * ]
    */
    const members = JSON.parse(fileContent);
    return members;
  }catch (err){
    console.error('發生錯誤:',err.message);
    throw err;
  }
}

// ========== 任務二：篩選 VIP 會員 ==========
/**
 * 從會員陣列中篩選出 level 為 "VIP" 的會員。
 *
 * @param {Array<Object>} members - 會員陣列
 * @returns {Array<Object>} 只包含 VIP 會員的新陣列
 *
 * @example
 *   filterVIP([
 *     { name: '小華', level: 'VIP' },
 *     { name: '小美', level: 'normal' }
 *   ]); // [{ name: '小華', level: 'VIP' }]
 */
function filterVIP(members) {

  // TODO: 實作此函式
  // 提示：用 Array.prototype.filter，不要修改原陣列
  /*
  * filter() 會依序把陣列中的每一個元素（Element）傳進函式，函式只回傳 true 或 false，並保留callback回傳 true的元素，組成一個新的陣列回傳。
  * true--->留下入新的空陣列; false ---> 丟掉
  * members.filter(...):對 members 陣列做篩選。
  * (參數) => 表達式
  * (member) => ...:對members陣列中的每個元素判斷，member = members[0]、member = members[1]...
  */
  const vipMembers = members.filter((member)=>(member.level==='VIP'));
  return vipMembers;
}

// ========== 任務三：計算會員剩餘點數總和 ==========
/**
 * 加總會員陣列中所有人的 credits 欄位。
 *
 * @param {Array<{credits: number}>} members - 會員陣列
 * @returns {number} credits 總和，空陣列回傳 0
 *
 * @example
 *   sumCredits([{ credits: 120 }, { credits: 30 }]); // 150
 *   sumCredits([]);                                  // 0
 */

function sumCredits(members) {
  // TODO: 實作此函式
  // 提示：用 reduce，初始值給 0
  /** reduce觀念
   *  1. 累積函式
   *  2. callback 每一圈都會收到：
   *      - acc：目前累積值
   *      - member：目前處理的元素(Element)
   *  3. callback 必須回傳新的 acc。
   *  4. 最後 reduce 會回傳最後一次的 acc
   *  5. 下一圈的 acc = 上一圈 callback 回傳值。
   * 語法:
   * reduce((參數1,參數2)=>(表達式),reduce初始值)
   * 表達式放callback的值(回傳的值)
   */
  const totalCredits = members.reduce((acc,member)=>(acc + member.credits),0);
  return totalCredits;
}

// ========== 任務四：讀取環境變數 ==========
/**
 * 從 process.env 讀取健身房設定，組成設定物件。
 *
 * 規則：
 *   - GYM_NAME 未設定 → 預設 '未命名健身房'
 *   - ADMIN_NAME 未設定 → 預設 '尚未指派'
 *   - DEFAULT_MEMBERS_PATH → 原樣回傳（沒有預設值）
 *
 * @returns {{gymName: string, adminName: string, defaultMembersPath: string | undefined}}
 *
 * @example
 *   process.env.GYM_NAME = 'FitClub';
 *   process.env.ADMIN_NAME = 'Leo';
 *   getGymConfig();
 *   // { gymName: 'FitClub', adminName: 'Leo', defaultMembersPath: undefined }
 */
function getGymConfig() {
  // TODO: 實作此函式
  // 提示：用 || 給預設值
  const gymData = {
    gymName: process.env.GYM_NAME || '未命名健身房',
    adminName: process.env.ADMIN_NAME || '尚未指派',
    defaultMembersPath: process.env.DEFAULT_MEMBERS_PATH,
  };
  return gymData;
}

// ========== 任務五：VIP 會員統計摘要（綜合題）==========
/**
 * 讀取會員檔案、篩出 VIP、回傳統計摘要。
 *
 * 可以（也建議）呼叫前面寫好的 readMembers / filterVIP / sumCredits。
 *
 * @param {string} filePath - 會員 JSON 檔案的路徑
 * @returns {Promise<{count: number, totalCredits: number, names: string[]}>}
 *
 * @example
 *   await getVIPSummary('./fixtures/members.json');
 *   // { count: 2, totalCredits: 320, names: ['小華', '阿強'] }
 */
async function getVIPSummary(filePath) {
  // TODO: 實作此函式
  // 步驟：
  //   1. 讀會員資料
  //   2. 篩出 VIP
  //   3. 算總點數、收集姓名
  //   4. 回傳 { count, totalCredits, names }
  const members = await readMembers(filePath);
  const vipMembers = filterVIP(members);
  const totalCredits = sumCredits(vipMembers);
  //把每位VIP會員轉換成姓名
  //目前vipMembers=[{name:'Andy',credits:100},{name:'Jerry',credits:55}....{name:'Tom',credits:500}]
  //目標轉換成 ['Andy','Jerry',..,'Tom']
  const vipNames = vipMembers.map((vipMember)=>(vipMember.name));
  const vipData = {
    count: vipMembers.length,
    totalCredits:  totalCredits,
    names: vipNames,
  };
  return vipData;
}

module.exports = {
  readMembers,
  filterVIP,
  sumCredits,
  getGymConfig,
  getVIPSummary,
};
