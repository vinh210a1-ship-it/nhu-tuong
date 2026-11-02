---
title: "Nguồn, mức đọc và khoảng trống"
slug: nguon-va-khoang-trong
khu: duoc-pham
thu_tu: 10
loai: nguon
hien_tren_web: false
updated: 2026-11-01
nguon_goc: tai-lieu-duoc-pham/10-nguon-va-khoang-trong.md
---
# 10. Nguồn, mức đọc và khoảng trống

> File này tương ứng "danh mục nguồn" của các khu khác. Bản bảng tính (cùng khóa, cùng cột với `web-nhu-tuong/nguon/nguon.csv`) là `nguon-duoc-pham.csv`.

## Kết luận trước

- 80 nguồn: **18 văn bản quy định/hướng dẫn/chương chung dược điển** đã đọc trang gốc qua công cụ trích; **59 bài PubMed** đã kiểm siêu dữ liệu và tóm tắt (có DOI và PMID); **3 mục** (Pasquali 2008, Binarjo 2025, Smejkal 2024) chỉ đọc tóm tắt qua Consensus, trong đó Pasquali có PMID nhờ khớp trích dẫn.
- **Không có nguồn nào đã đọc toàn văn.** Số liệu trong bảng quy định lấy qua bước trích bằng mô hình nhỏ; trước khi đăng, đối chiếu PDF gốc.

## Môi trường truy cập (nói rõ)

- Truy cập trực tiếp bằng `curl` tới FDA, ICH, EMA, WHO, PubMed, Europe PMC, Crossref, OpenAlex, doi.org, MDPI, Frontiers đều bị proxy chặn (403). **Dùng được:** công cụ đọc trang web (WebFetch) với nhiều trang FDA/ICH/EMA/WHO/HSA/drugfuture; truy vấn PubMed; Consensus (còn rất ít lượt tháng này: 2 lượt đến 01/12).
- Nên mọi DOI/PMID của bài PubMed lấy từ siêu dữ liệu PubMed (đúng bài), không từ trí nhớ.
- **Khớp theo trích dẫn** (tạp chí–năm–tập–trang) với PubMed: Pasquali 2008 (PMID 18258397) chỉ khớp theo tạp chí/tập/trang, chưa thấy DOI.

## Khoảng trống và việc cần làm (có thể cần máy của người dùng)

| # | Khoảng trống | Vì sao quan trọng | Việc cần làm |
|---|---|---|---|
| 1 | **File IID của FDA** chưa tải | Bảng "tá dược × dạng × đường dùng × lượng đã có tiền lệ" cho lab | Tải trang `Inactive Ingredients Database Download` trên máy người dùng (CSV/Excel < 2 MB), đặt vào `/mnt/project-files/`; xử lý thành JSON |
| 2 | **Handbook of Pharmaceutical Excipients** | HLB riêng từng chất, nồng độ dùng, tương kỵ, an toàn | Cần sách/giấy phép; hoặc người dùng chụp các chuyên luận chọn lọc |
| 3 | **USP–NF, Ph. Eur. hiện hành**, **Dược điển Việt Nam V** | Chương chung (rã, hòa tan, mài mòn...) hiện đang dựa bản USP 38 (2015) trên trang lưu | Đối chiếu bản hiện hành hoặc dùng DĐVN V nếu có bản PDF |
| 4 | **SUPAC-SS** (bán rắn) | Ngưỡng thay đổi công thức kem/mỡ | Trang bị lỗi độ dài URL; thử lại với bản khác hoặc tải bản PDF |
| 5 | **EMA: tá dược trên nhãn và tờ hướng dẫn** | Mục "lưu ý an toàn" của thẻ tá dược | Đọc `Excipients in the labelling and package leaflet of medicinal products for human use` |
| 6 | **Văn bản Việt Nam về điều kiện thử ổn định** | Câu "Việt Nam yêu cầu 30/75" cần có căn cứ | Tìm trong thông tư đăng ký thuốc hiện hành; chưa tìm được |
| 7 | **Toàn văn** Amidon 1995, Williams 2013, Hou 2021, Albertsen 2022 | Dose number, bảng chiến lược theo BCS, bảng thành phần LNP | Lấy bản mở (PMC) nếu có hoặc xin người dùng |
| 8 | **Hỗn dịch** có nguồn riêng | Hiện bài 03 mục 2 là sách nền | Tìm review về kết tụ có kiểm soát và thể tích lắng |
| 9 | **Lưu biến bán rắn** có số | τ0, độ nhớt, n của kem/gel cụ thể | Tìm bài đo Carbopol/HPMC có số cụ thể |
| 10 | **HLB yêu cầu** từng loại dầu | Bảng rHLB để lab | Đối chiếu Griffin 1949 hoặc sổ tay |

## Quy tắc đăng web (nhắc lại)

- Số liệu K: ẩn số, chỉ hiện khái niệm.
- Trích từ PubMed: cần nêu **PubMed + DOI** khi dùng; đã có sẵn trong bảng nguồn.
- Không dùng tên sản phẩm thương mại để quảng cáo; chỉ làm ví dụ công nghệ có nguồn.


## A. Văn bản quy định, hướng dẫn, chương chung dược điển (đọc trang gốc qua công cụ trích)

- `@ichq1a` — ICH (2003). Q1A(R2) Stability Testing of New Drug Substances and Products. Step 4, 6/2/2003. [https://database.ich.org/sites/default/files/Q1A%28R2%29%20Guideline.pdf]
- `@ichq1b` — ICH (1996). Q1B Photostability Testing of New Drug Substances and Products. [https://database.ich.org/sites/default/files/Q1B%20Guideline.pdf]
- `@ichq1e` — ICH (2003). Q1E Evaluation of Stability Data. [https://database.ich.org/sites/default/files/Q1E%20Guideline.pdf]
- `@ichq8` — ICH (2009). Q8(R2) Pharmaceutical Development. [https://database.ich.org/sites/default/files/Q8_R2_Guideline.pdf]
- `@ichm9` — ICH (2019). M9 Biopharmaceutics Classification System-based Biowaivers (Step 4/5; bản đăng trên EMA). [https://www.ema.europa.eu/en/documents/scientific-guideline/ich-m9-biopharmaceutics-classification-system-based-biowaivers-step-5_en.pdf]
- `@fdabcs2017` — FDA (2017, tháng 12). Waiver of In Vivo Bioavailability and Bioequivalence Studies for Immediate-Release Solid Oral Dosage Forms Based on a Biopharmaceutics Classification System. Guidance for Industry. [https://www.fda.gov/media/70963/download]
- `@fdadissol1997` — FDA (1997). Dissolution Testing of Immediate Release Solid Oral Dosage Forms. Guidance for Industry. [https://fda.gov/media/70936/download]
- `@fdasupacir` — FDA/CDER (1995, tháng 11). Immediate Release Solid Oral Dosage Forms: Scale-Up and Postapproval Changes (SUPAC-IR). Guidance for Industry. [https://www.fda.gov/media/70949/download]
- `@fdaiid` — FDA. Inactive Ingredients Database Download (trang mô tả CSDL; cập nhật hằng quý). [https://www.fda.gov/drugs/drug-approvals-and-databases/inactive-ingredients-database-download]
- `@whotrs1010` — WHO (2018). Stability testing of active pharmaceutical ingredients and finished pharmaceutical products. WHO Technical Report Series No. 1010, Annex 10. [https://extranet.who.int/prequal/sites/default/files/document_files/TRS1010_Annex10.pdf]
- `@whotrs953t` — WHO (2009; bảng cập nhật 2018). TRS 953 Annex 2 Appendix 1: điều kiện lưu trữ dài hạn theo quốc gia. [https://gmp-compliance.org/files/guidemgr/trs953-annex2-appendix1-stability-conditions-table-2018.pdf]
- `@aseanstab` — ASEAN (2018). ASEAN Guideline on Stability Study of Drug Product, Version 2.0 (Revision 2), thông qua tại ACCSQ-PPWG lần 25. [https://www.hsa.gov.sg/docs/default-source/hprg/therapeutic-products/guidance-documents/asean-guideline-stability.pdf]
- `@pheur2936` — Ph. Eur. 11.5 (2024). Chương chung 2.9.36 Powder flow (07/2024:20936). [https://moodle2.units.it/pluginfile.php/761966/mod_resource/content/0/2.9.36%20Powder%20flow.pdf]
- `@usp729` — USP 38–NF 33. Chương chung <729> Globule Size Distribution in Lipid Injectable Emulsions (bản lưu trên drugfuture.com; ấn bản cũ). [https://www.drugfuture.com/Pharmacopoeia/usp38/data/v38332/usp38nf33s2_c729.html]
- `@usp701` — USP 38–NF 33. Chương chung <701> Disintegration (bản lưu trên drugfuture.com; ấn bản cũ). [https://www.drugfuture.com/Pharmacopoeia/usp38/data/v38332/usp38nf33s2_c701.html]
- `@usp711` — USP 38–NF 33. Chương chung <711> Dissolution (bản lưu trên drugfuture.com; ấn bản cũ). [https://www.drugfuture.com/Pharmacopoeia/usp38/data/v38332/usp38nf33s2_c711.html]
- `@usp1216` — USP 38–NF 33. Chương chung <1216> Tablet Friability (bản lưu trên drugfuture.com; ấn bản cũ). [https://www.drugfuture.com/Pharmacopoeia/usp38/data/v38332/usp38nf33s2_c1216.html]
- `@bytett11` — Bộ Y tế (2018). Thông tư 11/2018/TT-BYT quy định về chất lượng thuốc, nguyên liệu làm thuốc (ngày 04/05/2018, hiệu lực 20/06/2018); văn bản hợp nhất 01/VBHN-BYT ngày 02/01/2025 (đã sửa bởi TT 03/2020, 23/2021, 45/2024). [https://luatvietnam.vn/y-te/van-ban-hop-nhat-01-vbhn-byt-nam-2024-do-bo-y-te-ban-hanh-hop-nhat-thong-tu-quy-dinh-ve-chat-luong-thuoc-nguyen-lieu-lam-thuoc-384005-d5.html]

## B. Bài báo PubMed (đã kiểm siêu dữ liệu và tóm tắt)

- `@amidon1995` — Amidon GL, Lennernäs H, Shah VP, Crison JR (1995). A theoretical basis for a biopharmaceutic drug classification: the correlation of in vitro drug product dissolution and in vivo bioavailability. *Pharm Res* 12(3):413–420. [DOI 10.1023/a:1016212804288; PMID 7617530]
- `@shah2014` — Shah VP, Amidon GL (2014). G.L. Amidon, H. Lennernas, V.P. Shah, and J.R. Crison. A theoretical basis for a biopharmaceutic drug classification… Pharm Res 12, 413–420, 1995 — backstory of BCS. *AAPS J* 16(5):894–898. [DOI 10.1208/s12248-014-9620-9; PMID 24961917]
- `@pouton2000` — Pouton CW (2000). Lipid formulations for oral administration of drugs: non-emulsifying, self-emulsifying and 'self-microemulsifying' drug delivery systems. *Eur J Pharm Sci* 11 Suppl 2:S93–S98. [DOI 10.1016/s0928-0987(00)00167-6; PMID 11033431]
- `@pouton2006` — Pouton CW (2006). Formulation of poorly water-soluble drugs for oral administration: physicochemical and physiological issues and the lipid formulation classification system. *Eur J Pharm Sci* 29(3–4):278–287. [DOI 10.1016/j.ejps.2006.04.016; PMID 16815001]
- `@pouton2008` — Pouton CW, Porter CJH (2008). Formulation of lipid-based delivery systems for oral administration: materials, methods and strategies. *Adv Drug Deliv Rev* 60(6):625–637. [DOI 10.1016/j.addr.2007.10.010; PMID 18068260]
- `@waterman2011` — Waterman KC (2011). The application of the Accelerated Stability Assessment Program (ASAP) to quality by design (QbD) for drug product stability. *AAPS PharmSciTech* 12(3):932–937. [DOI 10.1208/s12249-011-9657-3; PMID 21748541]
- `@waterman2016` — Waterman R, Lewis J, Waterman KC (2016). Accelerated stability modeling for peptides: a case study with bacitracin. *AAPS PharmSciTech* 18(5):1692–1698. [DOI 10.1208/s12249-016-0635-7; PMID 27714699]
- `@waterman2005` — Waterman KC, Adami RC (2005). Accelerated aging: prediction of chemical stability of pharmaceuticals. *Int J Pharm* 293(1–2):101–125. [DOI 10.1016/j.ijpharm.2004.12.013; PMID 15778049]
- `@dressman1998` — Dressman JB, Amidon GL, Reppas C, Shah VP (1998). Dissolution testing as a prognostic tool for oral drug absorption: immediate release dosage forms. *Pharm Res* 15(1):11–22. [DOI 10.1023/a:1011984216775; PMID 9487541]
- `@galia1998` — Galia E, Nicolaides E, Hörter D, Löbenberg R, Reppas C, Dressman JB (1998). Evaluation of various dissolution media for predicting in vivo performance of class I and II drugs. *Pharm Res* 15(5):698–705. [DOI 10.1023/a:1011910801212; PMID 9619777]
- `@costa2001` — Costa P, Sousa Lobo JM (2001). Modeling and comparison of dissolution profiles. *Eur J Pharm Sci* 13(2):123–133. [DOI 10.1016/s0928-0987(01)00095-1; PMID 11297896]
- `@siepmann2013` — Siepmann J, Siepmann F (2013). Mathematical modeling of drug dissolution. *Int J Pharm* 453(1):12–24. [DOI 10.1016/j.ijpharm.2013.04.044; PMID 23618956]
- `@siepmann2001` — Siepmann J, Peppas NA (2001). Modeling of drug release from delivery systems based on hydroxypropyl methylcellulose (HPMC). *Adv Drug Deliv Rev* 48(2–3):139–157. [DOI 10.1016/s0169-409x(01)00112-0; PMID 11369079]
- `@savjani2012` — Savjani KT, Gajjar AK, Savjani JK (2012). Drug solubility: importance and enhancement techniques. *ISRN Pharm* 2012:195727. [DOI 10.5402/2012/195727; PMID 22830056]
- `@williams2013` — Williams HD, Trevaskis NL, Charman SA, Shanker RM, Charman WN, Pouton CW, Porter CJH (2013). Strategies to address low drug solubility in discovery and development. *Pharmacol Rev* 65(1):315–499. [DOI 10.1124/pr.112.005660; PMID 23383426]
- `@allen2013` — Allen TM, Cullis PR (2013). Liposomal drug delivery systems: from concept to clinical applications. *Adv Drug Deliv Rev* 65(1):36–48. [DOI 10.1016/j.addr.2012.09.037; PMID 23036225]
- `@brewster2007` — Brewster ME, Loftsson T (2007). Cyclodextrins as pharmaceutical solubilizers. *Adv Drug Deliv Rev* 59(7):645–666. [DOI 10.1016/j.addr.2007.05.012; PMID 17601630]
- `@loftsson2010` — Loftsson T, Brewster ME (2010). Pharmaceutical applications of cyclodextrins: basic science and product development. *J Pharm Pharmacol* 62(11):1607–1621. [DOI 10.1111/j.2042-7158.2010.01030.x; PMID 21039545]
- `@stella1997` — Stella VJ, Rajewski RA (1997). Cyclodextrins: their future in drug formulation and delivery. *Pharm Res* 14(5):556–567. [DOI 10.1023/a:1012136608249; PMID 9165524]
- `@keck2005` — Keck CM, Müller RH (2006). Drug nanocrystals of poorly soluble drugs produced by high pressure homogenisation. *Eur J Pharm Biopharm* 62(1):3–16. [DOI 10.1016/j.ejpb.2005.05.009; PMID 16129588]
- `@muller2004` — Müller RH, Keck CM (2004). Challenges and solutions for the delivery of biotech drugs — a review of drug nanocrystal technology and lipid nanoparticles. *J Biotechnol* 113(1–3):151–170. [DOI 10.1016/j.jbiotec.2004.06.007; PMID 15380654]
- `@merisko2011` — Merisko-Liversidge E, Liversidge GG (2011). Nanosizing for oral and parenteral drug delivery: a perspective on formulating poorly-water soluble compounds using wet media milling technology. *Adv Drug Deliv Rev* 63(6):427–440. [DOI 10.1016/j.addr.2010.12.007; PMID 21223990]
- `@bauer2001` — Bauer J, Spanton S, Henry R, Quick J, Dziki W, Porter W, Morris J (2001). Ritonavir: an extraordinary example of conformational polymorphism. *Pharm Res* 18(6):859–866. [DOI 10.1023/a:1011052932607; PMID 11474792]
- `@hancock1997` — Hancock BC, Zografi G (1997). Characteristics and significance of the amorphous state in pharmaceutical systems. *J Pharm Sci* 86(1):1–12. [DOI 10.1021/js9601896; PMID 9002452]
- `@hancock1995` — Hancock BC, Shamblin SL, Zografi G (1995). Molecular mobility of amorphous pharmaceutical solids below their glass transition temperatures. *Pharm Res* 12(6):799–806. [DOI 10.1023/a:1016292416526; PMID 7667182]
- `@serajuddin1999` — Serajuddin ATM (1999). Solid dispersion of poorly water-soluble drugs: early promises, subsequent problems, and recent breakthroughs. *J Pharm Sci* 88(10):1058–1066. [DOI 10.1021/js980403l; PMID 10514356]
- `@leuner2000` — Leuner C, Dressman J (2000). Improving drug solubility for oral delivery using solid dispersions. *Eur J Pharm Biopharm* 50(1):47–60. [DOI 10.1016/s0939-6411(00)00076-x; PMID 10840192]
- `@baghel2016` — Baghel S, Cathcart H, O'Reilly NJ (2016). Polymeric amorphous solid dispersions: a review of amorphization, crystallization, stabilization, solid-state characterization, and aqueous solubilization of BCS class II drugs. *J Pharm Sci* 105(9):2527–2544. [DOI 10.1016/j.xphs.2015.10.008; PMID 26886314]
- `@kawabata2011` — Kawabata Y, Wada K, Nakatani M, Yamada S, Onoue S (2011). Formulation design for poorly water-soluble drugs based on biopharmaceutics classification system: basic approaches and practical applications. *Int J Pharm* 420(1):1–10. [DOI 10.1016/j.ijpharm.2011.08.032; PMID 21884771]
- `@lipinski2001` — Lipinski CA, Lombardo F, Dominy BW, Feeney PJ (2001). Experimental and computational approaches to estimate solubility and permeability in drug discovery and development settings. *Adv Drug Deliv Rev* 46(1–3):3–26. [DOI 10.1016/s0169-409x(00)00129-0; PMID 11259830]
- `@horter2001` — Hörter D, Dressman JB (2001). Influence of physicochemical properties on dissolution of drugs in the gastrointestinal tract. *Adv Drug Deliv Rev* 46(1–3):75–87. [DOI 10.1016/s0169-409x(00)00130-7; PMID 11259834]
- `@evans1988` — Evans DF, Pye G, Bramley R, Clark AG, Dyson TJ, Hardcastle JD (1988). Measurement of gastrointestinal pH profiles in normal ambulant human subjects. *Gut* 29(8):1035–1041. [DOI 10.1136/gut.29.8.1035; PMID 3410329]
- `@davis1986` — Davis SS, Hardy JG, Fara JW (1986). Transit of pharmaceutical dosage forms through the small intestine. *Gut* 27(8):886–892. [DOI 10.1136/gut.27.8.886; PMID 3732895]
- `@faure2001` — Faure A, York P, Rowe RC (2001). Process control and scale-up of pharmaceutical wet granulation processes: a review. *Eur J Pharm Biopharm* 52(3):269–277. [DOI 10.1016/s0939-6411(01)00184-9; PMID 11677069]
- `@wang2010` — Wang J, Wen H, Desai D (2010). Lubrication in tablet formulations. *Eur J Pharm Biopharm* 75(1):1–15. [DOI 10.1016/j.ejpb.2010.01.007; PMID 20096779]
- `@patel2006` — Patel S, Kaushal AM, Bansal AK (2006). Compression physics in the formulation development of tablets. *Crit Rev Ther Drug Carrier Syst* 23(1):1–65. [DOI 10.1615/critrevtherdrugcarriersyst.v23.i1.10; PMID 16749898]
- `@jivraj2000` — Jivraj M, Martini LG, Thomson CM (2000). An overview of the different excipients useful for the direct compression of tablets. *Pharm Sci Technol Today* 3(2):58–63. [DOI 10.1016/s1461-5347(99)00237-0; PMID 10664574]
- `@desai2016` — Desai PM, Liew CV, Heng PWS (2016). Review of disintegrants and the disintegration phenomena. *J Pharm Sci* 105(9):2545–2555. [DOI 10.1016/j.xphs.2015.12.019; PMID 27506604]
- `@felton2013` — Felton LA, Porter SC (2013). An update on pharmaceutical film coating for drug delivery. *Expert Opin Drug Deliv* 10(4):421–435. [DOI 10.1517/17425247.2013.763792; PMID 23339342]
- `@hippal2010` — Hippalgaonkar K, Majumdar S, Kansara V (2010). Injectable lipid emulsions — advancements, opportunities and challenges. *AAPS PharmSciTech* 11(4):1526–1540. [DOI 10.1208/s12249-010-9526-5; PMID 20976577]
- `@singh2017` — Singh Y, Meher JG, Raval K, Khan FA, Chaurasia M, Jain NK, Chourasia MK (2017). Nanoemulsion: concepts, development and applications in drug delivery. *J Control Release* 252:28–49. [DOI 10.1016/j.jconrel.2017.03.008; PMID 28279798]
- `@gupta2016` — Gupta A, Eral HB, Hatton TA, Doyle PS (2016). Nanoemulsions: formation, properties and applications. *Soft Matter* 12(11):2826–2841. [DOI 10.1039/c5sm02958a; PMID 26924445]
- `@gursoy2004` — Gursoy RN, Benita S (2004). Self-emulsifying drug delivery systems (SEDDS) for improved oral delivery of lipophilic drugs. *Biomed Pharmacother* 58(3):173–182. [DOI 10.1016/j.biopha.2004.02.001; PMID 15082340]
- `@date2010` — Date AA, Desai N, Dixit R, Nagarsenker M (2010). Self-nanoemulsifying drug delivery systems: formulation insights, applications and advances. *Nanomedicine (Lond)* 5(10):1595–1616. [DOI 10.2217/nnm.10.126; PMID 21143036]
- `@lawrence2000` — Lawrence MJ, Rees GD (2000). Microemulsion-based media as novel drug delivery systems. *Adv Drug Deliv Rev* 45(1):89–121. [DOI 10.1016/s0169-409x(00)00103-4; PMID 11104900]
- `@wooster2008` — Wooster TJ, Golding M, Sanguansri P (2008). Impact of oil type on nanoemulsion formation and Ostwald ripening stability. *Langmuir* 24(22):12758–12765. [DOI 10.1021/la801685v; PMID 18850732]
- `@hakansson2019` — Håkansson A (2019). Emulsion formation by homogenization: current understanding and future perspectives. *Annu Rev Food Sci Technol* 10:239–258. [DOI 10.1146/annurev-food-032818-121501; PMID 30908953]
- `@olson1979` — Olson F, Hunt CA, Szoka FC, Vail WJ, Papahadjopoulos D (1979). Preparation of liposomes of defined size distribution by extrusion through polycarbonate membranes. *Biochim Biophys Acta* 557(1):9–23. [DOI 10.1016/0005-2736(79)90085-3; PMID 95096]
- `@barenholz2012` — Barenholz Y (2012). Doxil® — the first FDA-approved nano-drug: lessons learned. *J Control Release* 160(2):117–134. [DOI 10.1016/j.jconrel.2012.03.020; PMID 22484195]
- `@cullis2017` — Cullis PR, Hope MJ (2017). Lipid nanoparticle systems for enabling gene therapies. *Mol Ther* 25(7):1467–1475. [DOI 10.1016/j.ymthe.2017.03.013; PMID 28412170]
- `@hou2021` — Hou X, Zaks T, Langer R, Dong Y (2021). Lipid nanoparticles for mRNA delivery. *Nat Rev Mater* 6(12):1078–1094. [DOI 10.1038/s41578-021-00358-0; PMID 34394960]
- `@albertsen2022` — Hald Albertsen C, Kulkarni JA, Witzigmann D, Lind M, Petersson K, Simonsen JB (2022). The role of lipid components in lipid nanoparticles for vaccines and gene therapy. *Adv Drug Deliv Rev* 188:114416. [DOI 10.1016/j.addr.2022.114416; PMID 35787388]
- `@chang2013` — Chang RK, Raw A, Lionberger R, Yu L (2013). Generic development of topical dermatologic products: formulation development, process development, and testing of topical dermatologic products. *AAPS J* 15(1):41–52. [DOI 10.1208/s12248-012-9411-0; PMID 23054971]
- `@lee2009` — Lee CH, Moturi V, Lee Y (2009). Thixotropic property in pharmaceutical formulations. *J Control Release* 136(2):88–98. [DOI 10.1016/j.jconrel.2009.02.013; PMID 19250955]
- `@airaksinen2005` — Airaksinen S, Karjalainen M, Shevchenko A, Westermarck S, Leppänen E, Rantanen J, Yliruusi J (2005). Role of water in the physical stability of solid dosage formulations. *J Pharm Sci* 94(10):2147–2165. [DOI 10.1002/jps.20411; PMID 16136577]
- `@wirth1998` — Wirth DD, Baertschi SW, Johnson RA, Maple SR, Miller MS, Hallenbeck DK, Gregg SM (1998). Maillard reaction of lactose and fluoxetine hydrochloride, a secondary amine. *J Pharm Sci* 87(1):31–39. [DOI 10.1021/js9702067; PMID 9452965]
- `@hovorka2001` — Hovorka SW, Schöneich C (2001). Oxidative degradation of pharmaceuticals: theory, mechanisms and inhibition. *J Pharm Sci* 90(3):253–269. [DOI 10.1002/1520-6017(200103)90:3<253::aid-jps1>3.0.co;2-w; PMID 11170019]
- `@kishore2011` — Kishore RSK, Pappenberger A, Dauphin IB, Ross A, Buergi B, Staempfli A, Mahler HC (2011). Degradation of polysorbates 20 and 80: studies on thermal autoxidation and hydrolysis. *J Pharm Sci* 100(2):721–731. [DOI 10.1002/jps.22290; PMID 20803573]
- `@pifferi2003` — Pifferi G, Restani P (2003). The safety of pharmaceutical excipients. *Farmaco* 58(8):541–550. [DOI 10.1016/S0014-827X(03)00079-X; PMID 12875883]

## C. Chỉ ở mức tiêu đề/tóm tắt qua Consensus hoặc khớp trích dẫn

- `@pasquali2008` — Pasquali RC, Taurozzi MP, Bregni C (2008). Some considerations about the hydrophilic-lipophilic balance system. *Int J Pharm* 356(1–2):44–51. (Tìm PMID bằng khớp trích dẫn; tóm tắt đọc qua Consensus.) [PMID 18258397]
- `@binarjo2025` — Binarjo A et al. (2025). Determination of required hydrophilic-lipophilic balance (RHLB) of oleic acid-rich vegetable oil as internal phase of O/W emulsion. *Bull Pharm Sci Assiut Univ*. (Chỉ đọc tóm tắt qua Consensus; chưa có DOI.) [https://consensus.app/papers/details/7686211833615d6790e699ce433bed1e/]
- `@smejkal2024` — Smejkal G et al. (2024). Theoretical and experimental determinations of the hydrophilic–lipophilic balance (HLB) of representative oils and lecithins. *Colloids Interfaces*. (Chỉ đọc tóm tắt qua Consensus; chưa có DOI.) [https://consensus.app/papers/details/7da40eb8018c5880bdb7f08c0f8b0276/]
