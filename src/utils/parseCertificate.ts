import ASN1 from "@lapo/asn1js";

export const parseCertificate = (subArray: ASN1[]) => {
  let parseSubArray: any[] = [];

  subArray.forEach((item: ASN1) => {
    // console.log('typeName:', item.typeName());
    // console.log(item.content());

    if (item.sub === null) {
      parseSubArray.push({
        [item.typeName()]: item.content()
      });
    } else {
      parseSubArray.push({
        [item.typeName()]: item.content(),
        sub: parseCertificate(item.sub)
      });
    }

  });

  return parseSubArray;
}