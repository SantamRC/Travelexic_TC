const CurrencyData = [
  {
    abrivation: "GGP",
    short_name: "Guernsey pound",
    imageFile: require("../assets/images/ggp.png"),
  },
  {
    abrivation: "IMP",
    short_name: "Manx pound",
    imageFile: require("../assets/images/imp.png"),
  },
  {
    abrivation: "XAU",
    short_name: "Gold (troy ounce)",
    imageFile: require("../assets/images/xau.png"),
  },
  {
    abrivation: "JEP",
    short_name: "Jersey pound",
    imageFile: require("../assets/images/jep.png"),
  },
  {
    abrivation: "ZWL",
    short_name: "Zimbabwean dollar",
    imageFile: require("../assets/images/zwl.png"),
  },
  {
    abrivation: "XAG",
    short_name: "Silver (troy ounce)",
    imageFile: require("../assets/images/xag.png"),
  },
  {
    abrivation: "PLN",
    short_name: "Polish złoty",
    imageFile: require("../assets/images/pln.png"),
  },
  {
    abrivation: "UGX",
    short_name: "Ugandan shilling",
    imageFile: require("../assets/images/ugx.png"),
  },
  {
    abrivation: "MWK",
    short_name: "Malawian kwacha",
    imageFile: require("../assets/images/mwk.png"),
  },
  {
    abrivation: "MRU",
    short_name: "Mauritanian ouguiya",
    imageFile: require("../assets/images/mru.png"),
  },
  {
    abrivation: "STN",
    short_name: "São Tomé and Príncipe dobra",
    imageFile: require("../assets/images/stn.png"),
  },
  {
    abrivation: "XDR",
    short_name: "Special drawing rights",
    imageFile: require("../assets/images/xdr.png"),
  },
  {
    abrivation: "EUR",
    short_name: "Euro",
    imageFile: require("../assets/images/eur.png"),
  },
  {
    abrivation: "NAD",
    short_name: "Namibian dollar",
    imageFile: require("../assets/images/nad.png"),
  },
  {
    abrivation: "ALL",
    short_name: "Albanian lek",
    imageFile: require("../assets/images/all.png"),
  },
  {
    abrivation: "BHD",
    short_name: "Bahraini dinar",
    imageFile: require("../assets/images/bhd.png"),
  },
  {
    abrivation: "BBD",
    short_name: "Barbadian dollar",
    imageFile: require("../assets/images/bbd.png"),
  },
  {
    abrivation: "RSD",
    short_name: "Serbian dinar",
    imageFile: require("../assets/images/rsd.png"),
  },
  {
    abrivation: "VND",
    short_name: "Vietnamese đồng",
    imageFile: require("../assets/images/vnd.png"),
  },
  {
    abrivation: "SDG",
    short_name: "Sudanese pound",
    imageFile: require("../assets/images/sdg.png"),
  },
  {
    abrivation: "VES",
    short_name: "Venezuelan bolívar",
    imageFile: require("../assets/images/ves.png"),
  },
  {
    abrivation: "ZMW",
    short_name: "Zambian kwacha",
    imageFile: require("../assets/images/zmw.png"),
  },
  {
    abrivation: "KGS",
    short_name: "Kyrgyzstani som",
    imageFile: require("../assets/images/kgs.png"),
  },
  {
    abrivation: "BYN",
    short_name: "Belarusian ruble",
    imageFile: require("../assets/images/byn.png"),
  },
  {
    abrivation: "BOB",
    short_name: "Bolivian boliviano",
    imageFile: require("../assets/images/bob.png"),
  },
  {
    abrivation: "SRD",
    short_name: "Surinamese dollar",
    imageFile: require("../assets/images/srd.png"),
  },
  {
    abrivation: "HUF",
    short_name: "Hungarian forint",
    imageFile: require("../assets/images/huf.png"),
  },
  {
    abrivation: "BND",
    short_name: "Brunei dollar",
    imageFile: require("../assets/images/bnd.png"),
  },
  {
    abrivation: "BAM",
    short_name: "Bosnia and Herzegovina convertible mark",
    imageFile: require("../assets/images/bam.png"),
  },
  {
    abrivation: "BWP",
    short_name: "Botswana pula",
    imageFile: require("../assets/images/bwp.png"),
  },
  {
    abrivation: "CVE",
    short_name: "Cape Verdean escudo",
    imageFile: require("../assets/images/cve.png"),
  },
  {
    abrivation: "BGN",
    short_name: "Bulgarian lev",
    imageFile: require("../assets/images/bgn.png"),
  },
  {
    abrivation: "NOK",
    short_name: "Norwegian krone",
    imageFile: require("../assets/images/nok.png"),
  },
  {
    abrivation: "BRL",
    short_name: "Brazilian real",
    imageFile: require("../assets/images/brl.png"),
  },
  {
    abrivation: "JPY",
    short_name: "Japanese yen",
    imageFile: require("../assets/images/jpy.png"),
  },
  {
    abrivation: "HRK",
    short_name: "Croatian kuna",
    imageFile: require("../assets/images/hrk.png"),
  },
  {
    abrivation: "HKD",
    short_name: "Hong Kong dollar",
    imageFile: require("../assets/images/hkd.png"),
  },
  {
    abrivation: "ISK",
    short_name: "Icelandic króna",
    imageFile: require("../assets/images/isk.png"),
  },
  {
    abrivation: "IDR",
    short_name: "Indonesian rupiah",
    imageFile: require("../assets/images/idr.png"),
  },
  {
    abrivation: "KRW",
    short_name: "South Korean won",
    imageFile: require("../assets/images/krw.png"),
  },
  {
    abrivation: "KHR",
    short_name: "Cambodian riel",
    imageFile: require("../assets/images/khr.png"),
  },
  {
    abrivation: "XAF",
    short_name: "Central African CFA franc",
    imageFile: require("../assets/images/xaf.png"),
  },
  {
    abrivation: "CHF",
    short_name: "Swiss franc",
    imageFile: require("../assets/images/chf.png"),
  },
  {
    abrivation: "MXN",
    short_name: "Mexican peso",
    imageFile: require("../assets/images/mxn.png"),
  },
  {
    abrivation: "PHP",
    short_name: "Philippine peso",
    imageFile: require("../assets/images/php.png"),
  },
  {
    abrivation: "RON",
    short_name: "Romanian leu",
    imageFile: require("../assets/images/ron.png"),
  },
  {
    abrivation: "RUB",
    short_name: "Russian ruble",
    imageFile: require("../assets/images/rub.png"),
  },
  {
    abrivation: "SGD",
    short_name: "Singapore dollar",
    imageFile: require("../assets/images/sgd.png"),
  },
  {
    abrivation: "AED",
    short_name: "United Arab Emirates dirham",
    imageFile: require("../assets/images/aed.png"),
  },
  {
    abrivation: "KWD",
    short_name: "Kuwaiti dinar",
    imageFile: require("../assets/images/kwd.png"),
  },
  {
    abrivation: "CAD",
    short_name: "Canadian dollar",
    imageFile: require("../assets/images/cad.png"),
  },
  {
    abrivation: "PKR",
    short_name: "Pakistani rupee",
    imageFile: require("../assets/images/pkr.png"),
  },
  {
    abrivation: "CLP",
    short_name: "Chilean peso",
    imageFile: require("../assets/images/clp.png"),
  },
  {
    abrivation: "CNY",
    short_name: "Renminbi",
    imageFile: require("../assets/images/cny.png"),
  },
  {
    abrivation: "COP",
    short_name: "Colombian peso",
    imageFile: require("../assets/images/cop.png"),
  },
  {
    abrivation: "AOA",
    short_name: "Angolan kwanza",
    imageFile: require("../assets/images/aoa.png"),
  },
  {
    abrivation: "KMF",
    short_name: "Comorian franc",
    imageFile: require("../assets/images/kmf.png"),
  },
  {
    abrivation: "CRC",
    short_name: "Costa Rican colón",
    imageFile: require("../assets/images/crc.png"),
  },
  {
    abrivation: "CUP",
    short_name: "Cuban peso",
    imageFile: require("../assets/images/cup.png"),
  },
  {
    abrivation: "GNF",
    short_name: "Guinean franc",
    imageFile: require("../assets/images/gnf.png"),
  },
  {
    abrivation: "NZD",
    short_name: "New Zealand dollar",
    imageFile: require("../assets/images/nzd.png"),
  },
  {
    abrivation: "EGP",
    short_name: "Egyptian pound",
    imageFile: require("../assets/images/egp.png"),
  },
  {
    abrivation: "DJF",
    short_name: "Djiboutian franc",
    imageFile: require("../assets/images/djf.png"),
  },
  {
    abrivation: "ANG",
    short_name: "Netherlands Antillean guilder",
    imageFile: require("../assets/images/ang.png"),
  },
  {
    abrivation: "DOP",
    short_name: "Dominican peso",
    imageFile: require("../assets/images/dop.png"),
  },
  {
    abrivation: "JOD",
    short_name: "Jordanian dinar",
    imageFile: require("../assets/images/jod.png"),
  },
  {
    abrivation: "AZN",
    short_name: "Azerbaijani manat",
    imageFile: require("../assets/images/azn.png"),
  },
  {
    abrivation: "SVC",
    short_name: "Salvadoran colón",
    imageFile: require("../assets/images/svc.png"),
  },
  {
    abrivation: "ERN",
    short_name: "Eritrean nakfa",
    imageFile: require("../assets/images/ern.png"),
  },
  {
    abrivation: "SZL",
    short_name: "Swazi lilangeni",
    imageFile: require("../assets/images/szl.png"),
  },
  {
    abrivation: "DKK",
    short_name: "Danish krone",
    imageFile: require("../assets/images/dkk.png"),
  },
  {
    abrivation: "ETB",
    short_name: "Ethiopian birr",
    imageFile: require("../assets/images/etb.png"),
  },
  {
    abrivation: "FJD",
    short_name: "Fijian dollar",
    imageFile: require("../assets/images/fjd.png"),
  },
  {
    abrivation: "XPF",
    short_name: "CFP franc",
    imageFile: require("../assets/images/xpf.png"),
  },
  {
    abrivation: "GMD",
    short_name: "Gambian dalasi",
    imageFile: require("../assets/images/gmd.png"),
  },
  {
    abrivation: "AFN",
    short_name: "Afghan afghani",
    imageFile: require("../assets/images/afn.png"),
  },
  {
    abrivation: "GHS",
    short_name: "Ghanaian cedi",
    imageFile: require("../assets/images/ghs.png"),
  },
  {
    abrivation: "GIP",
    short_name: "Gibraltar pound",
    imageFile: require("../assets/images/gip.png"),
  },
  {
    abrivation: "GTQ",
    short_name: "Guatemalan quetzal",
    imageFile: require("../assets/images/gtq.png"),
  },
  {
    abrivation: "GEL",
    short_name: "Georgian lari",
    imageFile: require("../assets/images/gel.png"),
  },
  {
    abrivation: "HNL",
    short_name: "Honduran lempira",
    imageFile: require("../assets/images/hnl.png"),
  },
  {
    abrivation: "GYD",
    short_name: "Guyanese dollar",
    imageFile: require("../assets/images/gyd.png"),
  },
  {
    abrivation: "HTG",
    short_name: "Haitian gourde",
    imageFile: require("../assets/images/htg.png"),
  },
  {
    abrivation: "XCD",
    short_name: "Eastern Caribbean dollar",
    imageFile: require("../assets/images/xcd.png"),
  },
  {
    abrivation: "GBP",
    short_name: "Pound sterling",
    imageFile: require("../assets/images/gbp.png"),
  },
  {
    abrivation: "AMD",
    short_name: "Armenian dram",
    imageFile: require("../assets/images/amd.png"),
  },
  {
    abrivation: "VUV",
    short_name: "Vanuatu vatu",
    imageFile: require("../assets/images/vuv.png"),
  },
  {
    abrivation: "IRR",
    short_name: "Iranian rial",
    imageFile: require("../assets/images/irr.png"),
  },
  {
    abrivation: "JMD",
    short_name: "Jamaican dollar",
    imageFile: require("../assets/images/jmd.png"),
  },
  {
    abrivation: "IQD",
    short_name: "Iraqi dinar",
    imageFile: require("../assets/images/iqd.png"),
  },
  {
    abrivation: "KZT",
    short_name: "Kazakhstani tenge",
    imageFile: require("../assets/images/kzt.png"),
  },
  {
    abrivation: "KES",
    short_name: "Kenyan shilling",
    imageFile: require("../assets/images/kes.png"),
  },
  {
    abrivation: "ILS",
    short_name: "Israeli new shekel",
    imageFile: require("../assets/images/ils.png"),
  },
  {
    abrivation: "LYD",
    short_name: "Libyan dinar",
    imageFile: require("../assets/images/lyd.png"),
  },
  {
    abrivation: "LSL",
    short_name: "Lesotho loti",
    imageFile: require("../assets/images/lsl.png"),
  },
  {
    abrivation: "LBP",
    short_name: "Lebanese pound",
    imageFile: require("../assets/images/lbp.png"),
  },
  {
    abrivation: "LRD",
    short_name: "Liberian dollar",
    imageFile: require("../assets/images/lrd.png"),
  },
  {
    abrivation: "AWG",
    short_name: "Aruban florin",
    imageFile: require("../assets/images/awg.png"),
  },
  {
    abrivation: "MKD",
    short_name: "Macedonian denar",
    imageFile: require("../assets/images/mkd.png"),
  },
  {
    abrivation: "LAK",
    short_name: "Lao kip",
    imageFile: require("../assets/images/lak.png"),
  },
  {
    abrivation: "MGA",
    short_name: "Malagasy ariary",
    imageFile: require("../assets/images/mga.png"),
  },
  {
    abrivation: "ZAR",
    short_name: "South African rand",
    imageFile: require("../assets/images/zar.png"),
  },
  {
    abrivation: "MDL",
    short_name: "Moldovan leu",
    imageFile: require("../assets/images/mdl.png"),
  },
  {
    abrivation: "MVR",
    short_name: "Maldivian rufiyaa",
    imageFile: require("../assets/images/mvr.png"),
  },
  {
    abrivation: "MUR",
    short_name: "Mauritian rupee",
    imageFile: require("../assets/images/mur.png"),
  },
  {
    abrivation: "MMK",
    short_name: "Burmese kyat",
    imageFile: require("../assets/images/mmk.png"),
  },
  {
    abrivation: "MAD",
    short_name: "Moroccan dirham",
    imageFile: require("../assets/images/mad.png"),
  },
  {
    abrivation: "XOF",
    short_name: "West African CFA franc",
    imageFile: require("../assets/images/xof.png"),
  },
  {
    abrivation: "MNT",
    short_name: "Mongolian tögrög",
    imageFile: require("../assets/images/mnt.png"),
  },
  {
    abrivation: "MZN",
    short_name: "Mozambican metical",
    imageFile: require("../assets/images/mzn.png"),
  },
  {
    abrivation: "MYR",
    short_name: "Malaysian ringgit",
    imageFile: require("../assets/images/myr.png"),
  },
  {
    abrivation: "OMR",
    short_name: "Omani rial",
    imageFile: require("../assets/images/omr.png"),
  },
  {
    abrivation: "NIO",
    short_name: "Nicaraguan córdoba",
    imageFile: require("../assets/images/nio.png"),
  },
  {
    abrivation: "NPR",
    short_name: "Nepalese rupee",
    imageFile: require("../assets/images/npr.png"),
  },
  {
    abrivation: "NGN",
    short_name: "Nigerian naira",
    imageFile: require("../assets/images/ngn.png"),
  },
  {
    abrivation: "PAB",
    short_name: "Panamanian balboa",
    imageFile: require("../assets/images/pab.png"),
  },
  {
    abrivation: "PGK",
    short_name: "Papua New Guinean kina",
    imageFile: require("../assets/images/pgk.png"),
  },
  {
    abrivation: "PYG",
    short_name: "Paraguayan guaraní",
    imageFile: require("../assets/images/pyg.png"),
  },
  {
    abrivation: "AUD",
    short_name: "Australian dollar",
    imageFile: require("../assets/images/aud.png"),
  },
  {
    abrivation: "PEN",
    short_name: "Peruvian sol",
    imageFile: require("../assets/images/pen.png"),
  },
  {
    abrivation: "ARS",
    short_name: "Argentine peso",
    imageFile: require("../assets/images/ars.png"),
  },
  {
    abrivation: "SAR",
    short_name: "Saudi riyal",
    imageFile: require("../assets/images/sar.png"),
  },
  {
    abrivation: "QAR",
    short_name: "Qatari riyal",
    imageFile: require("../assets/images/qar.png"),
  },
  {
    abrivation: "RWF",
    short_name: "Rwandan franc",
    imageFile: require("../assets/images/rwf.png"),
  },
  {
    abrivation: "WST",
    short_name: "Samoan tālā",
    imageFile: require("../assets/images/wst.png"),
  },
  {
    abrivation: "SCR",
    short_name: "Seychellois rupee",
    imageFile: require("../assets/images/scr.png"),
  },
  {
    abrivation: "SLL",
    short_name: "Sierra Leonean leone",
    imageFile: require("../assets/images/sll.png"),
  },
  {
    abrivation: "LKR",
    short_name: "Sri Lankan rupee",
    imageFile: require("../assets/images/lkr.png"),
  },
  {
    abrivation: "CZK",
    short_name: "Czech koruna",
    imageFile: require("../assets/images/czk.png"),
  },
  {
    abrivation: "SBD",
    short_name: "Solomon Islands dollar",
    imageFile: require("../assets/images/sbd.png"),
  },
  {
    abrivation: "SOS",
    short_name: "Somali shilling",
    imageFile: require("../assets/images/sos.png"),
  },
  {
    abrivation: "SSP",
    short_name: "South Sudanese pound",
    imageFile: require("../assets/images/ssp.png"),
  },
  {
    abrivation: "USD",
    short_name: "United States dollar",
    imageFile: require("../assets/images/usd.png"),
  },
  {
    abrivation: "DZD",
    short_name: "Algerian dinar",
    imageFile: require("../assets/images/dzd.png"),
  },
  {
    abrivation: "BDT",
    short_name: "Bangladeshi taka",
    imageFile: require("../assets/images/bdt.png"),
  },
  {
    abrivation: "BSD",
    short_name: "Bahamian dollar",
    imageFile: require("../assets/images/bsd.png"),
  },
  {
    abrivation: "BZD",
    short_name: "Belize dollar",
    imageFile: require("../assets/images/bzd.png"),
  },
  {
    abrivation: "BIF",
    short_name: "Burundian franc",
    imageFile: require("../assets/images/bif.png"),
  },
  {
    abrivation: "SEK",
    short_name: "Swedish krona",
    imageFile: require("../assets/images/sek.png"),
  },
  {
    abrivation: "INR",
    short_name: "Indian rupee",
    imageFile: require("../assets/images/inr.png"),
  },
  {
    abrivation: "CDF",
    short_name: "Congolese franc",
    imageFile: require("../assets/images/cdf.png"),
  },
  {
    abrivation: "UAH",
    short_name: "Ukrainian hryvnia",
    imageFile: require("../assets/images/uah.png"),
  },
  {
    abrivation: "MOP",
    short_name: "Macanese pataca",
    imageFile: require("../assets/images/mop.png"),
  },
  {
    abrivation: "YER",
    short_name: "Yemeni rial",
    imageFile: require("../assets/images/yer.png"),
  },
  {
    abrivation: "TMT",
    short_name: "Turkmenistan manat",
    imageFile: require("../assets/images/tmt.png"),
  },
  {
    abrivation: "UZS",
    short_name: "Uzbekistani soʻm",
    imageFile: require("../assets/images/uzs.png"),
  },
  {
    abrivation: "UYU",
    short_name: "Uruguayan peso",
    imageFile: require("../assets/images/uyu.png"),
  },
  {
    abrivation: "SYP",
    short_name: "Syrian pound",
    imageFile: require("../assets/images/syp.png"),
  },
  {
    abrivation: "TJS",
    short_name: "Tajikistani somoni",
    imageFile: require("../assets/images/tjs.png"),
  },
  {
    abrivation: "TWD",
    short_name: "New Taiwan dollar",
    imageFile: require("../assets/images/twd.png"),
  },
  {
    abrivation: "TZS",
    short_name: "Tanzanian shilling",
    imageFile: require("../assets/images/tzs.png"),
  },
  {
    abrivation: "TOP",
    short_name: "Tongan paʻanga",
    imageFile: require("../assets/images/top.png"),
  },
  {
    abrivation: "TTD",
    short_name: "Trinidad and Tobago dollar",
    imageFile: require("../assets/images/ttd.png"),
  },
  {
    abrivation: "THB",
    short_name: "Thai baht",
    imageFile: require("../assets/images/thb.png"),
  },
  {
    abrivation: "BMD",
    short_name: "Bermudian dollar",
    imageFile: require("../assets/images/bmd.png"),
  },
  {
    abrivation: "FKP",
    short_name: "Falkland Islands pound",
    imageFile: require("../assets/images/fkp.png"),
  },
  {
    abrivation: "KYD",
    short_name: "Cayman Islands dollar",
    imageFile: require("../assets/images/kyd.png"),
  },
  {
    abrivation: "SHP",
    short_name: "Saint Helena pound",
    imageFile: require("../assets/images/shp.png"),
  },
  {
    abrivation: "CUC",
    short_name: "Cuban convertible peso",
    imageFile: require("../assets/images/cuc.png"),
  },
  {
    abrivation: "BTN",
    short_name: "Bhutanese ngultrum",
    imageFile: require("../assets/images/btn.png"),
  },
  {
    abrivation: "TRY",
    short_name: "Turkish lira",
    imageFile: require("../assets/images/try.png"),
  },
  {
    abrivation: "TND",
    short_name: "Tunisian dinar",
    imageFile: require("../assets/images/tnd.png"),
  },
];
export default CurrencyData;
