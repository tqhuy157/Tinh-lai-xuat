"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [carPrice, setCarPrice] = useState<string>("0");
  const [downPayment, setDownPayment] = useState<string>("0");
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<string>("0");
  const [installmentMonths, setInstallmentMonths] = useState<number>(3);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [difference, setDifference] = useState<number>(0);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const parseVND = (value: string) => {
    return parseFloat(value.replace(/[^0-9]/g, "")) || 0;
  };

  const formatPercentage = (value: string) => {
    return value.replace(/^0+/, "").replace(/[^0-9.,]/g, "") + "%";
  };

  const parsePercentage = (value: string) => {
    const normalizedValue = value.replace(",", "."); // Chuyển dấu phẩy thành dấu chấm
    return parseFloat(normalizedValue.replace(/[^0-9.]/g, "")) || 0;
  };

  useEffect(() => {
    const parsedCarPrice = parseVND(carPrice);
    const parsedDownPayment = parseVND(downPayment);
    setLoanAmount(parsedCarPrice - parsedDownPayment);
  }, [carPrice, downPayment]);

  useEffect(() => {
    const parsedInterestRate = parsePercentage(interestRate);
    if (loanAmount > 0 && parsedInterestRate > 0 && installmentMonths > 0) {
      const monthlyInterestRate = parsedInterestRate / 100;
      const totalMonthlyInterest = loanAmount * monthlyInterestRate;
      const principalMonthlyPayment = loanAmount / installmentMonths;
      const totalMonthlyPayment =
        principalMonthlyPayment + totalMonthlyInterest;

      setMonthlyPayment(totalMonthlyPayment);
      setTotalPayment(totalMonthlyPayment * installmentMonths);
      setDifference(totalPayment - loanAmount);
    } else {
      setMonthlyPayment(0);
      setTotalPayment(0);
      setDifference(0);
    }
  }, [loanAmount, interestRate, installmentMonths]);

  return (
    <main className="w-full h-[100vh] overflow-y-auto p-[20px]">
      <form>
        <div className="flex flex-col gap-[8px] mb-4">
          <label>Giá trị xe bạn mua (vnđ)</label>
          <input
            value={carPrice !== "0" ? carPrice : ""}
            onChange={(e) => setCarPrice(e.currentTarget.value)}
            onBlur={() => setCarPrice(formatVND(parseVND(carPrice)))}
            className="border-[1px] h-[40px] w-[100%] px-[10px] rounded-[5px]"
            type="text"
            inputMode="numeric"
          />
        </div>
        <div className="flex flex-col gap-[8px] mb-4">
          <label>Số tiền trả trước (vnđ)</label>
          <input
            value={downPayment !== "0" ? downPayment : ""}
            onChange={(e) => setDownPayment(e.currentTarget.value)}
            onBlur={() => setDownPayment(formatVND(parseVND(downPayment)))}
            className="border-[1px] h-[40px] w-[100%] px-[10px] rounded-[5px]"
            type="text"
            inputMode="numeric"
          />
        </div>
        <div className="flex flex-col gap-[8px] mb-4">
          <label>Số tiền bạn sẽ vay (vnđ)</label>
          <input
            value={formatVND(loanAmount)}
            readOnly
            className="border-[1px] h-[40px] w-[100%] px-[10px] rounded-[5px]"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-[8px] mb-4">
          <label>Lãi suất (%)</label>
          <input
            value={interestRate !== "0" ? interestRate : ""}
            onChange={(e) => setInterestRate(e.currentTarget.value)}
            onBlur={() => setInterestRate(formatPercentage(interestRate))}
            className="border-[1px] h-[40px] w-[100%] px-[10px] rounded-[5px]"
            type="text"
            inputMode="decimal"
          />
        </div>
        <div className="flex flex-col gap-[8px] mb-4">
          <label>Lựa chọn thời gian trả góp:</label>
          <select
            value={installmentMonths}
            onChange={(e) => setInstallmentMonths(Number(e.target.value))}
            className="border-[1px] h-[40px] rounded-[5px]"
          >
            <option value="3">3 tháng</option>
            <option value="6">6 tháng</option>
            <option value="9">9 tháng</option>
            <option value="12">12 tháng</option>
            <option value="15">15 tháng</option>
            <option value="18">18 tháng</option>
            <option value="21">21 tháng</option>
            <option value="24">24 tháng</option>
          </select>
        </div>
        <div className="flex flex-col gap-[8px] mb-4">
          <label>Số tiền phải thanh toán hàng tháng (vnđ)</label>
          <input
            value={formatVND(monthlyPayment)}
            readOnly
            className="border-[1px] h-[40px] w-[100%] px-[10px] rounded-[5px]"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-[8px] mb-4">
          <label>Tổng tiền trả góp hàng tháng (vnđ)</label>
          <input
            value={formatVND(totalPayment)}
            readOnly
            className="border-[1px] h-[40px] w-[100%] px-[10px] rounded-[5px]"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-[8px] mb-4">
          <label>Số tiền chênh lệch(vnđ)</label>
          <p className="italic">
            (Tổng tiền trả góp hàng tháng - số tiền bạn vay){" "}
          </p>
          <input
            value={formatVND(difference)}
            readOnly
            className="border-[1px] h-[40px] w-[100%] px-[10px] rounded-[5px]"
            type="text"
          />
        </div>
      </form>
    </main>
  );
}
