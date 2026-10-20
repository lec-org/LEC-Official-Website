import admissionRecords from "../../public/admission/index.json";

/** 匹配学生记录后可返回的两种面试录取结果。 */
export type AdmissionStatus = "accepted" | "interview_failed";

/** public/admission/index.json 中的学生身份和录取结果。 */
export type AdmissionRecord = {
  studentId: string;
  name: string;
  status: AdmissionStatus;
};

/** 经校验并去除首尾空格的录取查询条件。 */
export type AdmissionQuery = {
  studentId: string;
  name: string;
};

/** 标记可向查询者展示的参数校验错误。 */
export class AdmissionValidationError extends Error {}

/** 校验查询请求，保留学号字符串并规范化字段首尾空格。 */
export function validateAdmissionQuery(input: unknown): AdmissionQuery {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new AdmissionValidationError("请求格式无效");
  }

  const fields = input as Record<string, unknown>;
  if (typeof fields.studentId !== "string" || !/^[0-9]{12}$/.test(fields.studentId.trim())) {
    throw new AdmissionValidationError("请输入 12 位数字学号");
  }
  if (typeof fields.name !== "string" || !fields.name.trim()) {
    throw new AdmissionValidationError("请输入姓名");
  }

  return { studentId: fields.studentId.trim(), name: fields.name.trim() };
}

/** 同时精确匹配学号和姓名，仅返回录取状态，不暴露完整学生记录。 */
export function findAdmissionStatus(query: AdmissionQuery): AdmissionStatus | null {
  const record = admissionRecords.find(
    (record) => record.studentId === query.studentId && record.name === query.name,
  );
  if (!record) return null;
  if (record.status !== "accepted" && record.status !== "interview_failed") {
    throw new Error("录取状态配置无效");
  }
  return record.status;
}
