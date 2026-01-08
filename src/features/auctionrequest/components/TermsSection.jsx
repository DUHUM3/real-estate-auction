import React from 'react';

/**
 * Terms and conditions section of the form
 */
function TermsSection({ termsAccepted, onInputChange }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          name="terms_accepted"
          checked={termsAccepted}
          onChange={onInputChange}
          className="mt-1 w-5 h-5 text-[#53a1dd] rounded focus:ring-[#53a1dd]"
          required
        />
        <div>
          <label className="text-gray-700 block mb-2">
            أوافق على{' '}
            <a
              href="#"
              className="text-[#53a1dd] hover:text-[#478bc5] font-medium underline"
            >
              الشروط والأحكام
            </a>{' '}
            الخاصة بتسويق المنتجات العقارية
          </label>
          <p className="text-gray-500 text-sm">
            قرأت وفهمت الشروط والأحكام وأوافق عليها بالكامل،
            وأقر بصحة جميع المعلومات المقدمة.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsSection;