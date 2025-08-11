import React from "react";
import CategorizeQuestion from "./QuestionTypes/CategorizeQuestion";
import { questionService } from "../../services/questionService";

export default function QuestionEditor({ question, onSaved, onDeleted }) {
  if (question.questionType !== "categorize") {
    return <div>Unsupported question type in this editor for now.</div>;
  }

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

  return (
    <CategorizeQuestion
      initialQuestion={question}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}
