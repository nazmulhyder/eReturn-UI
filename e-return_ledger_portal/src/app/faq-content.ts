export class FaqContent {
    public static contentLIst: Map<string, string> = new Map<string, string>([
      ['How to update your source tax and AIT payments', 'উৎস কর ও AIT পরিশোধের তথ্য কীভাবে আপডেট করবেন'],
      ['How you will update your source tax and AIT payments made between 1 July 2020 to 30 June 2021',
       '১ জুলাই ২০২০ - ৩০ জুন ২০২১ সময়ে যে উৎস কর ও AIT পরিশোধ করেছেন তা যেভাবে আপডেট করবেন'],
      ["Click 'Verify Source Tax' in the menu at the left to update your source tax payments.", 
      "উৎস কর আপডেটের জন্য বামপাশের 'Verify Source Tax' মেনুতে ক্লিক করুন।"],
      ["Select your source tax category. For example, if you have paid source tax against your iBAS pay bill, select 'iBAS++ (Salary)'.",
       "আপনার উৎস কর যে ক্যাটাগরীতে পড়ে সেটা সিলেক্ট করুন। যেমন, আপনি আইবাস বেতন বিলের বিপরীতে উৎস কর প্রদান করে থাকলে 'iBAS++ (Salary)' সিলেক্ট করুন।"],
      ["Input your source tax amount in 'TDS Claim' field and click 'Save' button. Verified source tax amount will display in output lines.",
       "এবার 'TDS Claim' ফিল্ডে পরিশোধিত উৎস করের অংক ইনপুট দিন এবং 'Save' বাটনে ক্লিক করুন। নীচের আউটপুট লাইনে ভেরিফাইড উৎস করের অংক দেখা যাবে।"],
      ["If you want to edit any source tax figure in output line, click 'Edit' icon and enter changed source tax amount in 'TDS Claim' field.", 
      "আউটপুট লাইনে উৎস করের অংকে কোনো পরিবর্তন চাইলে 'edit' আইকনে  ক্লিক করুন এবং উপরের 'TDS Claim' ফিল্ডে পরিবর্তিত অংক ইনপুট দিন।"],
      ["For dropping entire output line of any source tax, click 'Delete' icon.", 
      "আউটপুট লাইনে উৎস করের কোনো লাইন সম্পূর্ন বাদ দিতে চাইলে 'delete' আইকনে ক্লিক করুন।"],

      ["When you finish the update of all available source taxes, go to 'Tax Payment Status' in the menu to find your verified source tax amount.",
       "উৎস করের ভেরিফিকেশন পর্ব শেষ হলে মেনুর নীচের অংশে থাকা 'Tax Payment Status' সিলেক্ট করে আপনার ভেরিফাইড উৎস করের হিসাব দেখে নিন।"],      
      ["Select 'Go to eReturn' for going back to eReturn system and complete remaining tasks once you are done with update.",
       "কাজ শেষ হলে 'Go to eReturn' সিলেক্ট  করুন এবং eReturn সিস্টেমে গিয়ে বাকী কাজ সম্পন্ন করুন।"],      
      ['Guidelines for AIT verification will be added gradually.', 'AIT এর ভেরিফিকেশন গাইডলাইন পর্যায়ক্রমে যোগ হবে।'],
      ['Search Option', 'Search অপশন'],
      ["Click 'Search' button to know what is your source tax amount according to the system of your withholding agents.", 
      "উৎস কর আদায়কারী সিস্টেমে আপনার পরিশোধকৃত করের তথ্য কী আছে তা 'Search' বাটনে ক্লিক করে জেনে নিতে পারেন।"],      
      ['You may want to know', 'গুরুত্বপূর্ণ তথ্য'],
      ['Online verification of source tax usually requires connectivity with withholding agent’s system. The process may take some time ranging from few seconds to few minutes.', 
      'উৎস কর কর্তনকারীর সাথে অনলাইনে সংযুক্ত হয়ে উৎস করের অনলাইন ভেরিফিকেশন সম্পন্ন হয় বিধায় ভেরিফিকেশন প্রসেসে সাধারণভাবে কয়েক সেকেন্ড এবং কোনো কোনো ক্ষেত্রে কয়েক মিনিট পর্যন্ত সময় লাগতে পারে।'],
      ["Connectivity with many systems of withholding tax agents is under process. All your source tax and advance tax payments may not yet display as 'Verified Tax payment' due to the fact that your withholding agent has not yet connected to eReturn Ledger system. In such case, if you like to submit paper return instead of filing online, you may get a system-prepared offline (paper) return.",
       "অনেক উৎস কর এবং AIT এর ক্ষেত্রে আদায়কারী সিস্টেমের সাথে সংযুক্তির কাজ চলমান রয়েছে। অনলাইন সংযুক্তি এখনও সম্পন্ন না হওয়ার কারণে আপনার উৎসে পরিশোধিত করের সব তথ্য 'Verified Tax Payment' হিসেবে প্রদর্শিত নাও হতে পারে।  সেক্ষেত্রে অনলাইন রিটার্ন দিতে না চাইলে আপনি সিস্টেম থেকে অফলাইন (পেপার) রিটার্ন বানিয়ে নিতে পারেন।"],      
      ["Select 'Go to eReturn' option, and in 'Tax & Payment' page of eReturn, click 'Proceed to offline (paper) return' to get your offline (paper) return prepared by eReturn system.", 
      "অফলাইন (পেপার) রিটার্নের জন্য 'Go to eReturn' সিলেক্ট করে ই-রিটার্ন সিস্টেমে গিয়ে 'Tax & Payment' অংশে 'Proceed to offline (paper) return' বাটনে ক্লিক করুন। পেয়ে যাবেন সিস্টেমে তৈরি নির্ভরযোগ্য অফলাইন (পেপার) রিটার্ন।"],  
    ]);
  
    public static selectedLanguageCode = '1';
  
  }
  
  
  export const languageList = [
    {code: '0', label: 'English'},
    {code: '1', label: 'বাংলা'}];
  
  export function content(text: string) {
    if (FaqContent.selectedLanguageCode === '0') {
      return text;
    } else {
      return FaqContent.contentLIst.has(text) ? FaqContent.contentLIst.get(text) : text;
    }
  }
  
  