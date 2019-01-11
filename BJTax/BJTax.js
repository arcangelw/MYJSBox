const kMonth = "kMonth"; // 月份
const kTaxAmount = "kTaxAmount"; // 月需纳税额
const kTaxInfo = "kTaxInfo"; // 纳税信息
const kTaxRate = "kTaxRate"; // 税率
const kQuickDeduction = "kQuickDeduction"; // 速扣
const kTaxSum = "kTaxSum"; // 累计已经纳税额
const kTaxAmountSum = "kTaxAmountSum"; // 累计需纳税额
const kTaxAmountSumInterval = "kTaxAmountSumInterval"; // 累计纳税额区间
const kTax = "kTax"; // 当月纳税
const kTaxAnnualSum = "kTaxAnnualSum"; // 全年纳税
const kProvident = "kProvident"; // 每月公积金
const kSocial = "kSocial"; // 没月社保

function taxSum(taxs) {
  return taxs.length > 0
    ? taxs.reduce(function add(x, y) {
        return x + y;
      })
    : 0.0;
}
function startCalculating(taxAmount) {
  var datas = { kTaxAmount: taxAmount.toFixed(2) };
  var taxs = [];
  var taxInfos = [];
  var taxAmountSum = 0.0;
  for (var i = 1; i <= 12; i++) {
    var taxInfo = {};
    taxInfo[kMonth] = i + "月";
    taxAmountSum = i * taxAmount;
    taxInfo[kTaxAmountSum] = taxAmountSum.toFixed(2);
    var taxRate = 1.0;
    var quickDeduction = 0.0;
    var taxAmountSumInterval = "";
    if (taxAmountSum <= 36000.0) {
      taxRate = 0.03;
      quickDeduction = 0.0;
      taxAmountSumInterval = "<=36000";
    } else if (taxAmountSum > 36000.0 && taxAmountSum <= 144000.0) {
      taxRate = 0.1;
      quickDeduction = 2520.0;
      taxAmountSumInterval = ">36000 && <=144000";
    } else if (taxAmountSum > 144000.0 && taxAmountSum <= 300000.0) {
      taxRate = 0.2;
      quickDeduction = 16920.0;
      taxAmountSumInterval = ">144000 && <=300000";
    } else if (taxAmountSum > 300000.0 && taxAmountSum <= 420000.0) {
      taxRate = 0.25;
      quickDeduction = 31920.0;
      taxAmountSumInterval = ">300000 && <=420000";
    } else if (taxAmountSum > 420000.0 && taxAmountSum <= 660000.0) {
      taxRate = 0.3;
      quickDeduction = 52920.0;
      taxAmountSumInterval = ">420000 && <=660000";
    } else if (taxAmountSum > 660000.0 && taxAmountSum <= 960000.0) {
      taxRate = 0.35;
      quickDeduction = 85920.0;
      taxAmountSumInterval = ">660000 && <=960000";
    } else if (taxAmountSum > 960000) {
      taxRate = 0.45;
      quickDeduction = 181920.0;
      taxAmountSumInterval = ">960000";
    }
    taxInfo[kTaxRate] = taxRate.toFixed(2);
    taxInfo[kQuickDeduction] = quickDeduction.toFixed(2);
    taxInfo[kTaxAmountSumInterval] = taxAmountSumInterval;
    var tmpTaxSum = taxSum(taxs);
    var tax = taxAmountSum * taxRate - quickDeduction - tmpTaxSum;
    taxs.push(tax);
    taxInfo[kTax] = tax.toFixed(2);
    tmpTaxSum = taxSum(taxs);
    taxInfo[kTaxSum] = tmpTaxSum.toFixed(2);
    taxInfos.push(taxInfo);
  }
  var taxAnnualSum = taxSum(taxs);
  datas[kTaxAnnualSum] = taxAnnualSum.toFixed(2);
  datas[kTaxInfo] = taxInfos;
  return datas;
}

$ui.render({
  props: {
    title: "2019北京个税计算器"
  },
  views: [
    {
      type: "scroll",
      props: {
        id: "super",
        bgcolor: $color("#F5F5F5")
      },
      layout: $layout.fill,
      events: {
        tapped: function(sender) {
          endEditing();
        }
      },
      views: [
        {
          type: "input",
          props: {
            id: "input0",
            autoFontSize: true,
            type: $kbType.decimal,
            placeholder: "请输入您的月收入",
            bgcolor: $color("#FFFFFF"),
            radius: 4.0,
            borderWidth: 0.5,
            borderColor: $color("#FFFFFF")
          },
          layout: function(make, view) {
            make.top.equalTo($("super").top).offset(40);
            make.centerX.equalTo($("super".centerX));
            make.left.equalTo(10);
            make.height.equalTo(40);
          }
        },
        {
          type: "input",
          props: {
            id: "input1",
            autoFontSize: true,
            type: $kbType.decimal,
            placeholder: "请输入您每月个税抵扣额",
            bgcolor: $color("#FFFFFF"),
            radius: 4.0,
            borderWidth: 0.5,
            borderColor: $color("#FFFFFF")
          },
          layout: function(make, view) {
            make.top.equalTo($("input0").bottom).offset(40);
            make.centerX.equalTo($("super".centerX));
            make.left.equalTo(10);
            make.height.equalTo(40);
          }
        },
        {
          type: "input",
          props: {
            id: "input2",
            autoFontSize: true,
            type: $kbType.decimal,
            placeholder: "请输入社保缴纳基数,默认是您的月收入",
            bgcolor: $color("#FFFFFF"),
            radius: 4.0,
            borderWidth: 0.5,
            borderColor: $color("#FFFFFF")
          },
          layout: function(make, view) {
            make.top.equalTo($("input1").bottom).offset(40);
            make.centerX.equalTo($("super".centerX));
            make.left.equalTo(10);
            make.height.equalTo(40);
          }
        },
        {
          type: "input",
          props: {
            id: "input3",
            autoFontSize: true,
            type: $kbType.decimal,
            placeholder: "请输入公积金缴纳基数,默认是您的月收入",
            bgcolor: $color("#FFFFFF"),
            radius: 4.0,
            borderWidth: 0.5,
            borderColor: $color("#FFFFFF")
          },
          layout: function(make, view) {
            make.top.equalTo($("input2").bottom).offset(40);
            make.centerX.equalTo($("super".centerX));
            make.left.equalTo(10);
            make.height.equalTo(40);
          }
        },
        {
          type: "button",
          props: {
            id: "button",
            bgcolor: $color("#FFFFFF"),
            titleColor: $color("#AAAAAA"),
            title: "开始计算",
            contentEdgeInsets: $insets(5, 10, 5, 10)
          },
          layout: function(make) {
            make.top.equalTo($("input3").bottom).offset(40);
            make.centerX.equalTo($("super".centerX));
          },
          events: {
            tapped: function(sender) {
              endEditing();
              calculate();
            }
          }
        }
      ]
    }
  ]
});

function listView(taxInfo) {
  var headerTitle =
    "每月应纳税额:¥" +
    taxInfo[kTaxAmount] +
    "\n全年纳税:¥" +
    taxInfo[kTaxAnnualSum] +
    "\n每月公积金:¥" +
    taxInfo[kProvident] +
    "\n每月社保:¥" +
    taxInfo[kSocial];
  var infos = taxInfo[kTaxInfo].map(function(taxInfo) {
    var info = {};
    var tax = taxInfo[kMonth] + " 纳税:¥" + taxInfo[kTax];
    tax = tax + "\n累计应纳税额:¥" + taxInfo[kTaxAmountSum];
    tax = tax + "\n累计所在区间:¥" + taxInfo[kTaxAmountSumInterval];
    tax =
      tax +
      "\n税率:" +
      taxInfo[kTaxRate] * 100 +
      "%  速扣:¥" +
      taxInfo[kQuickDeduction];
    tax = tax + "\n累计已纳税:¥" + taxInfo[kTaxSum];
    info["title"] = { text: tax };
    return info;
  });
  var data = [{ rows: infos }];
  var listView = {
    views: [
      {
        type: "list",
        props: {
          separatorHidden: false,
          rowHeight: 125,
          data: data,
          header: {
            type: "label",
            props: {
              height: 100,
              lines: 0,
              text: headerTitle,
              textColor: $color("#AAAAAA"),
              align: $align.left,
              font: $font(20)
            }
          },
          template: [
            {
              type: "label",
              props: {
                id: "title",
                lines: 0,
                textColor: $color("#AAAAAA"),
                align: $align.left,
                font: $font(20)
              },
              layout: $layout.fill
            }
          ]
        },
        layout: $layout.fill
      }
    ]
  };
  return listView;
}

function endEditing() {
  $("input0").blur();
  $("input1").blur();
  $("input2").blur();
  $("input3").blur();
}

function clamp(x, low, high) {
  return x > high ? high : x < low ? low : x;
}

function calculate() {
  var salary = Number($("input0").text);
  var decrease = Number($("input1").text);
  var socialBase = Number($("input2").text);
  socialBase = socialBase > 0.0 ? socialBase : salary;
  var providentBase =
    $("input3").text === "" ? salary : Number($("input3").text);
  if (salary < 0.0) {
    $ui.alert({
      title: "提示",
      message: "请输入您的月收入"
    });
  } else {
    /// 住房公积金 社保限制设置
    var provident = clamp(providentBase * 0.12, 258.0, 2774.0);
    var social =
      clamp(socialBase * 0.08, 246.56, 1849.44) +
      clamp(socialBase * 0.02 + 3.0, 95.48, 465.36) +
      clamp(socialBase * 0.002, 6.164, 46.236);
    var tmp = salary - provident - social - decrease - 5000.0;
    if (tmp <= 0.0) {
      $ui.alert({
        title: "提示",
        message: "您无需纳税"
      });
    } else {
      var data = startCalculating(tmp);
      data[kProvident] = provident.toFixed(2);
      data[kSocial] = social.toFixed(2);
      console.log(listView(data));
      $ui.push(listView(data));
    }
  }
}
