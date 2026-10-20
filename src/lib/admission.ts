/** 匹配学生记录后可返回的两种面试录取结果。 */
export type AdmissionStatus = "accepted" | "interview_failed";

/** 静态招新名单中的学生身份和录取结果，仅供服务端查询。 */
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

// 以下 36 条均为虚构示例。发布真实结果时在此替换，勿在客户端运行时导入本模块。
const admissionRecords: readonly AdmissionRecord[] = [
  { studentId: "202600000001", name: "示例学生01", status: "accepted" },
  { studentId: "202600000002", name: "示例学生02", status: "accepted" },
  { studentId: "202600000003", name: "示例学生03", status: "accepted" },
  { studentId: "202600000004", name: "示例学生04", status: "accepted" },
  { studentId: "202600000005", name: "示例学生05", status: "accepted" },
  { studentId: "202600000006", name: "示例学生06", status: "accepted" },
  { studentId: "202600000007", name: "示例学生07", status: "accepted" },
  { studentId: "202600000008", name: "示例学生08", status: "accepted" },
  { studentId: "202600000009", name: "示例学生09", status: "accepted" },
  { studentId: "202600000010", name: "示例学生10", status: "accepted" },
  { studentId: "202600000011", name: "示例学生11", status: "accepted" },
  { studentId: "202600000012", name: "示例学生12", status: "accepted" },
  { studentId: "202600000013", name: "示例学生13", status: "interview_failed" },
  { studentId: "202600000014", name: "示例学生14", status: "interview_failed" },
  { studentId: "202600000015", name: "示例学生15", status: "interview_failed" },
  { studentId: "202600000016", name: "示例学生16", status: "interview_failed" },
  { studentId: "202600000017", name: "示例学生17", status: "interview_failed" },
  { studentId: "202600000018", name: "示例学生18", status: "interview_failed" },
  { studentId: "202600000019", name: "示例学生19", status: "interview_failed" },
  { studentId: "202600000020", name: "示例学生20", status: "interview_failed" },
  { studentId: "202600000021", name: "示例学生21", status: "interview_failed" },
  { studentId: "202600000022", name: "示例学生22", status: "interview_failed" },
  { studentId: "202600000023", name: "示例学生23", status: "interview_failed" },
  { studentId: "202600000024", name: "示例学生24", status: "interview_failed" },
  { studentId: "202600000025", name: "示例学生25", status: "interview_failed" },
  { studentId: "202600000026", name: "示例学生26", status: "interview_failed" },
  { studentId: "202600000027", name: "示例学生27", status: "interview_failed" },
  { studentId: "202600000028", name: "示例学生28", status: "interview_failed" },
  { studentId: "202600000029", name: "示例学生29", status: "interview_failed" },
  { studentId: "202600000030", name: "示例学生30", status: "interview_failed" },
  { studentId: "202600000031", name: "示例学生31", status: "interview_failed" },
  { studentId: "202600000032", name: "示例学生32", status: "interview_failed" },
  { studentId: "202600000033", name: "示例学生33", status: "interview_failed" },
  { studentId: "202600000034", name: "示例学生34", status: "interview_failed" },
  { studentId: "202600000035", name: "示例学生35", status: "interview_failed" },
  { studentId: "202600000036", name: "示例学生36", status: "interview_failed" },
];

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
  return admissionRecords.find(
    (record) => record.studentId === query.studentId && record.name === query.name,
  )?.status ?? null;
}
