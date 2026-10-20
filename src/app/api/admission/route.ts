import { NextResponse } from "next/server";
import { AdmissionValidationError, findAdmissionStatus, validateAdmissionQuery } from "../../../lib/admission";

const responseHeaders = { "Cache-Control": "no-store" };

/** 公开录取查询接口：校验学号和姓名，仅返回该学生的录取状态。 */
export async function POST(request: Request) {
  try {
    const query = validateAdmissionQuery(await request.json());
    return NextResponse.json({ status: findAdmissionStatus(query) }, { headers: responseHeaders });
  } catch (error) {
    if (error instanceof AdmissionValidationError || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: error instanceof AdmissionValidationError ? error.message : "请求格式无效" },
        { status: 400, headers: responseHeaders },
      );
    }

    console.error("Admission query failed", error);
    return NextResponse.json(
      { error: "查询失败，请稍后重试" },
      { status: 500, headers: responseHeaders },
    );
  }
}
