package kr.infini.web.payment.in.web.view;

import kr.infini.web.payment.in.web.request.HomeReqParams;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(@ModelAttribute HomeReqParams params) {
        System.out.println(params.toString());
        return "home";
    }

    @GetMapping("/test")
    public String test() {
        return "test";
    }
}
