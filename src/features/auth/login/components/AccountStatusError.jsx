// Component for displaying account status errors (unverified, pending)

import React from "react";
import { FiAlertCircle, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";

function AccountStatusError({ status }) {
  if (!status) return null;

  if (status === "unverified") {
    return (
      <div className="mt-3 sm:mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2">
          <FiAlertCircle
            className="text-yellow-600 mt-0.5 flex-shrink-0"
            size={16}
          />
          <div className="text-xs text-yellow-800">
            <p className="font-medium mb-1">يرجى التحقق من بريدك الإلكتروني</p>
            <p>
              لم يتم تأكيد حسابك بعد. يرجى التحقق من بريدك الإلكتروني وتفعيل
              الحساب قبل تسجيل الدخول.
            </p>
            <button
              onClick={() => {
                toast.info("سيتم إضافة ميزة إعادة إرسال رابط التحقق قريباً", {
                  position: "top-center",
                });
              }}
              className="mt-2 text-yellow-700 hover:text-yellow-900 font-medium underline text-xs"
            >
              إعادة إرسال رابط التحقق
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="mt-3 sm:mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <FiClock className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">الحساب قيد المراجعة</p>
            <p>
              حسابك قيد المراجعة من قبل الإدارة. يرجى الانتظار حتى يتم الموافقة
              على حسابك. ستتلقى إشعاراً عبر البريد الإلكتروني عند الموافقة.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default AccountStatusError;