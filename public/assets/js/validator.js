function Validator(options) {

    function getParentElement(curentElement, selector) {
        while (curentElement.parentElement) {
            if (curentElement.parentElement.matches(selector)) {
                return curentElement.parentElement;

            } else {
                curentElement = curentElement.parentElement;
            }
        }
    }
    var selectorRules = {};

    function validate(inputElement, rule) {

        var errElement = getParentElement(inputElement, options.formGroupSelector).querySelector(options.errSelector);
        var errMessage;
        var rules = selectorRules[rule.selector];
        //loop throught rule ad check
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errMessage = rules[i](inputElement.value);

            }

            if (errMessage) break;
        }
        if (errMessage) {
            errElement.innerText = errMessage;
            errElement.style.color = "red";
            inputElement.style.borderColor = "red";
        } else {
            errElement.innerText = '';
            inputElement.style.borderColor = "white";
        }
        return !errMessage;

    }



    var formElement = document.querySelector(options.form);
    if (formElement) {
        options.rules.forEach(function(rule) {
            var inputElements = formElement.querySelectorAll(rule.selector);
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test]
            }
            // listen Event on blur
            Array.from(inputElements).forEach(function(inputElement) {
                inputElement.onblur = function() {
                    validate(inputElement, rule)
                }
            })

            // listen Evnet input
            var inputElement = formElement.querySelector(rule.selector);
            inputElement.oninput = function() {
                inputElement.classList.remove('invalid');
                var errMessageElement = getParentElement(inputElement, options.formGroupSelector).querySelector('.form-message');
                errMessageElement.innerHTML = '';
            }

        })


    }

    formElement = document.querySelector(options.form)
    if (formElement) {
        formElement.onsubmit = function(e) {
            e.preventDefault();
            isFormValid = true;
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });


            if (isFormValid) {
                if (typeof options.onsubmit === 'function') {
                    var enableInput = formElement.querySelectorAll('[name]');

                    var formValues = Array.from(enableInput).reduce(function(values, input) {
                        switch (input.type) {
                            case 'radio':
                            case 'checkbox':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            default:
                                values[input.name] = input.value
                        }
                        return values;
                    }, {});

                    options.onsubmit(formValues)

                } else {
                    //sumit defaut HTML
                    formElement.submit();
                }
            }
        }
    }


}



Validator.isRequired = function(selector, errMessage) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined : 'This field can`t empty !';
        }
    }
}
Validator.isEmail = function(selector, errMessage) {
    return {
        selector: selector,
        test: function(value) {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                return (undefined)
            }
            return errMessage || "You have entered an invalid email address!"
        }
    }
}
Validator.minLength = function(selector, min, errMessage) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : `More than ${min} Chacracter`
        }
    }
}
Validator.confirm = function(selector, getConfirmValue, errMessage) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : `Password not math`
        }
    }
}
Validator.available = function(selector, user, errMessage) {
    return {
        selector: selector,
        test: function(value) {
            return user == true ? undefined : ` `
        }
    }
}