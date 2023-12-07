import Big from "big.js";

// 精确计算
export function accFactory(method: "add" | "minus" | "times" | "div" = "add"): (...nums: number[]) => number {
  return function (...nums: number[]) {
    nums = nums.map(Number).filter((num) => num || num === 0);
    if (nums.length < 2) return nums[0] || 0;
    return (
      parseFloat(
        nums
          .slice(1)
          .reduce((prev, num) => prev[method](num), new Big(nums[0]))
          .toString()
      ) || 0
    );
  };
}

export const accAdd = accFactory("add");
export const accSub = accFactory("minus");
export const accMul = accFactory("times");
export const accDiv = accFactory("div");
