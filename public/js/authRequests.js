export async function signup(formId,userFullName,currentUserName,loginBtn,signupBtn,account,API_URL){
    const signUpPopover = document.getElementById(formId);
    const fullName = signUpPopover.querySelector(".signUpFullName")
    const username=signUpPopover.querySelector(".signUpUname")
    const email=signUpPopover.querySelector(".signUpEmail")
    const password = signUpPopover.querySelector(".signUpPass")
    const confpass = signUpPopover.querySelector(".confirmSignUpPass")
    const formData= {
        fullname: fullName.value.trim(),
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value.trim()
    }
    console.log(formData);
    
    if(!email.value.endsWith("@gmail.com")){
        alert("Enter email in correct format")
        email.value = ""
        password.value = ""
        confpass.value = ""
        return;
    }
    if(password.value.length<8){
        alert("Minimum length of password should be 8 characters")
        password.value = ""
        confpass.value = ""
        return;
    }
    if(password.value!==confpass.value){
        alert("Enter same password in both password fields")
        password.value = ""
        confpass.value = ""
        return;
    }
    const response = await fetch(`${API_URL}/auth/signup`,{
        method:"post",
        headers:{"Content-type":"application/json"},
        body: JSON.stringify(formData)
    })
    const result = await response.json()
    alert(result.message);
    if(result.message == 'Signed up successfully.'){
        username.value=""
        email.value=""
        password.value = ""
        confpass.value = ""
        signUpPopover.hidePopover()
        loginBtn.classList.add("noDisplay")
        signupBtn.classList.add("noDisplay")
        account.classList.remove("noDisplay")
        userFullName.innerHTML = "@"+result.uname
        currentUserName.innerHTML = result.fullName
    }
    else{
        username.value=""
        email.value=""
        password.value = ""
        confpass.value = ""
    }
}

export async function login(formId,userFullName,currentUserName,loginBtn,signupBtn,account,API_URL){
    const logInPopover = document.getElementById(formId);
    const username = document.querySelector(".logInUname")
    const password = document.querySelector(".logInPass")
    const formData = {
        username: username.value.trim(),
        password:password.value.trim()
    }
    const response = await fetch(`${API_URL}/auth/login`,{
        method: "POST",
        headers: {"Content-type":"application/json"},
        body:JSON.stringify(formData)
    })
    const result = await response.json()
    alert(result.message)
    if(result.message == "Logged In Successfully."){
        username.value = ""
        password.value = ""
        logInPopover.hidePopover()
        loginBtn.classList.add("noDisplay")
        signupBtn.classList.add("noDisplay")
        account.classList.remove("noDisplay")
        currentUserName.innerHTML = "@"+result.uname
        userFullName.innerHTML = result.fullName
    }
    else{
        username.value = ""
        password.value = ""
    }

}

export async function logout(formId,userFullName,currentUserName,loginBtn,signupBtn,account,API_URL,currentSong,setPlayerName,songSources,songList){
   const logoutConfPopover= document.getElementById(formId)
    const response =await fetch(`${API_URL}/auth/logout`,{
        method:"POST"
    })
    const result = await response.json()
    console.log(result);
    if(result.message === "Logged out successfully."){
        if(!currentSong[0].paused){
            currentSong[0].pause()
        }
        currentSong[0].currentTime = 0
        currentSong[0] = ""
        setPlayerName("",songSources,songList)
        logoutConfPopover.hidePopover()
        userFullName.innerHTML = ""
        currentUserName.innerHTML = ""
        account.classList.add("noDisplay")
        loginBtn.classList.remove("noDisplay")
        signupBtn.classList.remove("noDisplay")
    }
}

//Password reset Events:
const passwordResetForm = document.querySelector(".passwordResetForm")
const emailForOtp= passwordResetForm.querySelector(".registeredEmail")
let email;
export async function sendOtp(otpInput,otpVerificationBtn,otpSendingBtn,API_URL){
        email = emailForOtp.value.trim()
        const response = await fetch(`${API_URL}/auth/send-otp`,{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({email:email})
        })
        const result =await response.json()
        alert(result.message);
        if(result.message === "Otp sent successfully.") {
            otpInput.classList.toggle("noDisplay")
            otpVerificationBtn.classList.toggle("noDisplay")
            otpSendingBtn.classList.toggle("noDisplay")
        }
}

export async function verifyOtp(otpInput,emailForOtp,emailVerificationSection,passResetSection,otpVerificationBtn,otpSendingBtn,API_URL){
    const otpVerificationData = {
        email:email,
        otp: otpInput.value.trim()
    }
    console.log(otpVerificationData);
    
    const response = await fetch(`${API_URL}/auth/verify-otp`,{
        method: "POST",
        headers:{"Content-type":"application/json"},
        body: JSON.stringify(otpVerificationData)
    })
    const result = await response.json()
    console.log(result);
    if(result.message === "Otp verified successfully."){
        otpInput.value = ""
        emailForOtp.value = ""
        emailVerificationSection.classList.toggle("noDisplay")
        passResetSection.classList.toggle("noDisplay")
        otpVerificationBtn.classList.toggle("noDisplay")
        otpSendingBtn.classList.toggle("noDisplay")
        otpInput.classList.toggle("noDisplay")
    }
}
export async function changePass(emailVerificationSection,passResetSection,resetPassPopover,API_URL){
        let newPass = passwordResetForm.querySelector(".newPassInp")
        let confNewPass = passwordResetForm.querySelector(".confNewPassInp")
        if (newPass.value !== confNewPass.value) {
            alert("Enter same password in both password fields.")
            newPass.value = ""
            confNewPass.value = ""
            return;
        }
        const passData = {
            email:email,
            newPass:newPass.value
        }
        console.log(passData);
        
        const response = await fetch(`${API_URL}/auth/reset-pass`,{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify(passData)
        })
        const result = await response.json();
        alert(result.message);
        if(result.message === "Password updated successfully."){
            newPass.value = ""
            confNewPass.value = ""
            email=null;
            emailVerificationSection.classList.toggle("noDisplay")
            passResetSection.classList.toggle("noDisplay")
            resetPassPopover.hidePopover()
        }
}