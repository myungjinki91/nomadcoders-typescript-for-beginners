import {init, exit} from "./myPackage"

init({
    url: "https://example.com",
    debug: true,
})

exit(1)

localStorage.clear()