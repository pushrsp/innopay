package kr.infini.web.payment.in.web.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HomeReqParams {

    @JsonProperty("PayMethod")
    private String payMethod;

    @JsonProperty("MID")
    private String mid;

    @JsonProperty("MerchantKey")
    private String merchantKey;

    @JsonProperty("GoodsName")
    private String goodsName;

    @JsonProperty("Amt")
    private Integer amt;

    @JsonProperty("Moid")
    private String moid;

    @JsonProperty("BuyerName")
    private String buyerName;

    @JsonProperty("BuyerTel")
    private String buyerTel;

    @JsonProperty("BuyerEmail")
    private String buyerEmail;

    @JsonProperty("GoodsCnt")
    private Integer goodsCnt;

    @JsonProperty("MallReserved")
    private String mallReserved;

    @JsonProperty("OfferingPeriod")
    private Integer offeringPeriod;

    @JsonProperty("ArsConnType")
    private Integer arsConnType;

    @JsonProperty("DutyFreeAmt")
    private Integer dutyFreeAmt;

    @JsonProperty("EncodingType")
    private String encodingType;

    @JsonProperty("MallIP")
    private Integer mallIp;

    @JsonProperty("UserIP")
    private Integer userIp;

    @JsonProperty("mallUserID")
    private String mallUserId;

    @JsonProperty("User_ID")
    private String userId;

    @JsonProperty("MobileOpt")
    private String mobileOpt;

    @Override
    public String toString() {
        return "HomeReqParams{" +
                "payMethod='" + payMethod + '\'' +
                ", mid='" + mid + '\'' +
                ", merchantKey='" + merchantKey + '\'' +
                ", goodsName='" + goodsName + '\'' +
                ", amt=" + amt +
                ", moid='" + moid + '\'' +
                ", buyerName='" + buyerName + '\'' +
                ", buyerTel='" + buyerTel + '\'' +
                ", buyerEmail='" + buyerEmail + '\'' +
                ", goodsCnt=" + goodsCnt +
                ", mallReserved='" + mallReserved + '\'' +
                ", offeringPeriod=" + offeringPeriod +
                ", arsConnType=" + arsConnType +
                ", dutyFreeAmt=" + dutyFreeAmt +
                ", encodingType='" + encodingType + '\'' +
                ", mallIp=" + mallIp +
                ", userIp=" + userIp +
                ", mallUserId='" + mallUserId + '\'' +
                ", userId='" + userId + '\'' +
                ", mobileOpt='" + mobileOpt + '\'' +
                '}';
    }
}
