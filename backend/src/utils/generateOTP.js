import otpGenerator from "otp-generator";

const generateOTP = (length = 6) => {
  return otpGenerator.generate(length, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
};

export default generateOTP;