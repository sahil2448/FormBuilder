import React from "react";
import CategorizeQuestion from "./QuestionTypes/CategorizeQuestion";
import ClozeQuestion from "./QuestionTypes/ClozeQuestion";
import ComprehensionQuestion from "./QuestionTypes/ComprehensionQuestion";
import { questionService } from "../../services/questionService";

export default function QuestionEditor({ question, onSaved, onDeleted }) {
  const handleSave = async (payload) => {
    const res = await questionService.updateQuestion(question._id, payload);
    if (res.success) onSaved?.(res.data);
    else throw new Error(res.error || "Failed to save question");
  };

  const handleDelete = async () => {
    const res = await questionService.deleteQuestion(question._id);
    if (res.success) onDeleted?.(question._id);
    else throw new Error(res.error || "Failed to delete question");
  };

  switch (question.questionType) {
    case "categorize":
      return (
        <CategorizeQuestion
          initialQuestion={question}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      );
    case "cloze":
      return (
        <ClozeQuestion
          initialQuestion={question}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      );
    case "comprehension":
      return (
        <ComprehensionQuestion
          initialQuestion={question}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      );
    default:
      return <div>Unsupported question type in this editor.</div>;
  }
}
