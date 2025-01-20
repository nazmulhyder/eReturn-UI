export class PageContent {
    public static contentLIst: Map<string, string> = new Map<string, string>([
      ['eReturn FAQs', 'ই-রিটার্ন বিষয়ক জিজ্ঞাসা'],
      ['Can I use mobile device for eReturn?', 'মোবাইল ফোনে ই-রিটার্ন করা যাবে?'],
      ['Answer', 'উত্তর'],
      ['For best experience and performance, use a laptop or a desktop computer. Mobile devices may not display all user-friendly features.', 'ই-রিটার্নকে সহজ ও user-friendly করার জন্য অনেক features দেয়া আছে, যার অনেকগুলো মোবাইল ডিভাইসে পাওয়া যাবে না। তাই ল্যাপটপ বা ডেস্কটপ কম্পিউটারে ই-রিটার্ন করুন।'],
      ['How can I sign in eReturn?', 'ই-রিটার্ন সিস্টেমে সাইন-ইন কীভাবে করবো?'],
      ['You will need your TIN and a password for sign in. You will set your own password at the time of registration, and can sign in any time using your TIN and password.', 'ই-রিটার্ন সিস্টেমে সাইন-ইন করতে হলে টিআইএন এবং পাসওয়ার্ড লাগবে। পাসওয়ার্ড পাওয়ার জন্য রেজিস্ট্রেশন করতে হয়। রেজিস্ট্রেশনের সময় আপনি নিজের পাসওয়ার্ড নিজে ঠিক করে নিবেন। এরপর যে কোনো সময় আপনার টিআইএন এবং এই পাসওয়ার্ড ব্যবহার করে ই-রিটার্ন সিস্টেমে লগ-ইন করতে পারবেন।'],
      ['What I need for registration?', 'রেজিস্ট্রেশন করতে কী লাগে?'],
      ['For registration, your will need a biometrically verified phone number. To know whether your phone number is biometrically verified or not, you may dial *16001# from your phone.', 'ই-রিটার্ন সিস্টেমে রেজিস্ট্রেশন করতে টিআইএন এবং আপনার নিজের নামে নিবন্ধিত (biometrically verified) মোবাইল ফোন নম্বর লাগে। আপনার মোবাইল ফোন নম্বরটি ভেরিফাইড কি না তা আপনার ফোন থেকে *১৬০০১# নম্বরে ডায়াল করে জেনে নিতে পারেন।'],
      ['I no longer use the phone number that was used at the time of TIN registration. Will it be a problem?', 'টিআইএন খোলার সময় যে ফোন নম্বর দিয়েছিলাম তা এখন আর নেই। আমি রেজিস্ট্রেশন করতে পারবো?'],
      ['Not at all. Just use your present biometrically verified phone number.', 'পারবেন। টিআইএন খোলার সময় যে ফোন নম্বর দিয়েছিলেন তা গুরুত্বপূর্ণ না। আপনার নিজের নামে নিবন্ধিত (biometrically verified) যে কোনো মোবাইল ফোন দিয়ে রেজিস্ট্রেশন করুন।'],
      ['Is there any password rule?', 'পাসওয়ার্ড সেট করার কোনো নিয়ম আছে?'],
      ['Yes. Your password will be minimum 8 characters, having at least 1 lower case character, 1 upper case character, 1 digit and 1 special character (such as @, #, %. & and &). When using a laptop or a desktop computer, you will find password checker.', ' পাসওয়ার্ড কমপক্ষে আট character বিশিষ্ট হবে। এর মধ্যে কমপক্ষে একটি করে lower case, upper case, digit (0-9) এবং special character (@, #, %, &, ইত্যাদি) থাকতে হবে। ল্যাপটপ বা ডেস্কটপ কম্পিউটার ব্যবহার করলে সিস্টেম আপনাকে গাইড করবে।'],
      ['How can I attach supporting documents?', 'সাপোর্টিং কাগজ পত্র কোথায়, কীভাবে attach করতে হবে?'],
      ['You do not need to attach any documents. Just fill in relevant fields. Just this will do. Your assessment will be completed in system, and you will instantly get system generated acknowledgment slip. You may also print tax certificate and a copy of your return by clicking ‘Tax Records’ menu at the left of the home page.', 'অনলাইন রিটার্ন দাখিলে কোনো কিছু attach করতে হবে না। আপনি দরকারি কাগজপত্র সাথে নিয়ে বসুন এবং প্রয়োজনীয় ফিল্ডগুলোতে নির্ভুলভাবে এন্ট্রি দিন। এতেই হবে। অনলাইনে রিটার্ন submit করার সাথে সাথে সিস্টেমে আপনার অ্যাসেসমেন্ট হয়ে যাবে এবং আপনি প্রাপ্তি স্বীকারপত্র পেয়ে যাবেন। ট্যাক্স সার্টিফিকেটও সাথে সাথে তৈরি হয়ে যাবে। বামপাশের Tax Records মেনুতে ক্লিক করে আপনি যে কোনো সময় প্রাপ্তি স্বীকারপত্র, ট্যাক্স সার্টিফিকেট ও রিটার্নের কপি প্রিন্ট নিতে পারবেন।'],
      ['Do I need to present support documents to tax office for getting my assessment done?', 'অনলাইনে রিটার্ন সাবমিট করার পর আবার কি সার্কেলে গিয়ে কাগজপত্র দাখিল করতে হবে?'],
      ['No. You do not need. Your assessment will be completed in system as soon as you make online submission of your return.', 'না, হবে না। অনলাইনে রিটার্ন submit করার সাথে সাথেই আপনার অ্যাসেসমেন্ট সম্পন্ন হয়ে যাবে। '],
      ['I have paid source tax (and/or advance tax). Can I use eReturn?', 'আমার উৎস কর এবং অগ্রীম কর দেয়া আছে। আমি কি ই-রিটার্ন সিস্টেম ব্যবহার করতে পারবো?'],
      ['You can prepare your paper return using eReturn system, make a print copy and submit in the tax office. Online verification of source tax and advance tax requires a number of APIs. The process is ongoing. Online filing option for taxpayers, who paid source tax/advance tax, will be opened gradually.', 'ই-রিটার্ন সিস্টেম ব্যবহার করে আপনার পেপার রিটার্ন তৈরি করে নিতে পারবেন। আপনার দেয়া তথ্যের উপর ভিত্তি করে ই-রিটার্ন সিস্টেম নির্ভুলভাবে আপনার রিটার্ন বানিয়ে দিবে, যা প্রিন্ট করে আপনি সার্কেলে জমা দিতে পারবেন। উৎস বা অগ্রীম করের অনলাইন ভেরিফিকেশনের জন্য অন্যান্য সিস্টেমের সাথে কানেক্টিভিটি (API) লাগে। API স্থাপনের কাজ চলমান আছে, যা শেষ হলে উৎস বা অগ্রীম কর প্রদানকারী করদাতাগণ অনলাইনে রিটার্ন submit করতে পারবেন।'],
      ['If I need to pay any tax with return, can I make online payment?', 'অনলাইনে রিটার্ন সাবমিট করার সময় কোনো ট্যাক্স দিতে হলে আমি কি অনলাইন পেমেন্ট করতে পারবো?'],
      ['Yes. You can make online payment using eReturn system at the time of filing online return.', 'হ্যাঁ, পারবেন। অনলাইন রিটার্ন সাবমিট করার সময় কোনো ট্যাক্স দিতে হলে ই-রিটার্ন সিস্টেম থেকেই অনলাইন পেমেন্ট করা যাবে।'],
        
    ]);
  
    public static selectedLanguageCode = '0';
  
  }
  
  
  export const languageList = [
    {code: '0', label: 'বাংলা'},
    {code: '1', label: 'English'}];
  
  export function content(text: string) {
    if (PageContent.selectedLanguageCode === '1') {
      return text;
    } else {
      return PageContent.contentLIst.has(text) ? PageContent.contentLIst.get(text) : text;
    }
  }
  
  