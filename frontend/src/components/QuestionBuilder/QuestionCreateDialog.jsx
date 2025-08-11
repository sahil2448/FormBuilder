// import React, { useState, useMemo } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import { questionService } from "../../services/questionService";

// function CategorizeMinimal({ value, onChange }) {
//   const addCategory = () => {
//     const id = "cat-" + Math.random().toString(36).slice(2, 8);
//     onChange({
//       ...value,
//       categories: [
//         ...value.categories,
//         {
//           categoryId: id,
//           categoryName: `Category ${value.categories.length + 1}`,
//         },
//       ],
//     });
//   };
//   const addItem = () => {
//     const id = "item-" + Math.random().toString(36).slice(2, 8);
//     onChange({
//       ...value,
//       items: [
//         ...value.items,
//         {
//           itemId: id,
//           itemText: `Item ${value.items.length + 1}`,
//           correctCategory: null,
//         },
//       ],
//     });
//   };
//   return (
//     <Box className="space-y-3">
//       <Button variant="outlined" onClick={addCategory}>
//         Add Category
//       </Button>
//       <Button variant="outlined" onClick={addItem}>
//         Add Item
//       </Button>
//       <div className="text-sm text-gray-600">
//         Categories: {value.categories.length} | Items: {value.items.length}
//       </div>
//     </Box>
//   );
// }

// function ClozeMinimal({ value, onChange }) {
//   return (
//     <Box className="space-y-3">
//       <TextField
//         label="Cloze Text (use {{blank}} to mark blanks)"
//         fullWidth
//         multiline
//         rows={3}
//         value={value.text}
//         onChange={(e) => onChange({ ...value, text: e.target.value })}
//       />
//     </Box>
//   );
// }

// function ComprehensionMinimal({ value, onChange }) {
//   return (
//     <Box className="space-y-3">
//       <TextField
//         label="Passage"
//         fullWidth
//         multiline
//         rows={3}
//         value={value.passage}
//         onChange={(e) => onChange({ ...value, passage: e.target.value })}
//       />
//       <TextField
//         label="Question"
//         fullWidth
//         value={value.question}
//         onChange={(e) => onChange({ ...value, question: e.target.value })}
//       />
//     </Box>
//   );
// }

// export default function QuestionCreateDialog({
//   open,
//   onClose,
//   formId,
//   onCreated,
// }) {
//   const [type, setType] = useState("categorize");
//   const [common, setCommon] = useState({
//     questionText: "",
//     points: 1,
//     instructions: "",
//   });

//   const [categorize, setCategorize] = useState({ categories: [], items: [] });
//   const [cloze, setCloze] = useState({ text: "" });
//   const [comprehension, setComprehension] = useState({
//     passage: "",
//     question: "",
//   });

//   React.useEffect(() => {
//     if (!open) {
//       setType("categorize");
//       setCommon({ questionText: "", points: 1, instructions: "" });
//       setCategorize({ categories: [], items: [] });
//       setCloze({ text: "" });
//       setComprehension({ passage: "", question: "" });
//     }
//   }, [open]);

//   const TypeBody = useMemo(() => {
//     switch (type) {
//       case "categorize":
//         return (
//           <CategorizeMinimal value={categorize} onChange={setCategorize} />
//         );
//       case "cloze":
//         return <ClozeMinimal value={cloze} onChange={setCloze} />;
//       case "comprehension":
//         return (
//           <ComprehensionMinimal
//             value={comprehension}
//             onChange={setComprehension}
//           />
//         );
//       default:
//         return null;
//     }
//   }, [type, categorize, cloze, comprehension]);

//   const buildPayload = () => {
//     const base = {
//       formId,
//       questionType: type,
//       questionText: common.questionText.trim(),
//       points: Number(common.points) || 1,
//       instructions: common.instructions.trim(),
//     };
//     if (type === "categorize") return { ...base, ...categorize };
//     if (type === "cloze") return { ...base, clozeText: cloze.text, blanks: [] };
//     if (type === "comprehension")
//       return {
//         ...base,
//         passage: comprehension.passage,
//         subQuestion: comprehension.question,
//         options: [],
//         correctAnswers: [],
//       };
//     return base;
//   };

//   const canSubmit = () => {
//     if (!common.questionText.trim()) return false;
//     if (type === "categorize")
//       return categorize.categories.length >= 1 && categorize.items.length >= 1;
//     if (type === "cloze") return cloze.text.trim().length > 0;
//     if (type === "comprehension")
//       return (
//         comprehension.passage.trim().length > 0 &&
//         comprehension.question.trim().length > 0
//       );
//     return true;
//   };

//   const handleCreate = async () => {
//     const payload = buildPayload();
//     const res = await questionService.createQuestion(payload);
//     if (res.success) {
//       onCreated?.(res.data);
//       onClose();
//     } else {
//       console.error(res.error || "Failed to create question");
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Create Question</DialogTitle>
//       <DialogContent dividers>
//         <Box className="space-y-4">
//           <FormControl fullWidth>
//             <InputLabel>Question Type</InputLabel>
//             <Select
//               value={type}
//               label="Question Type"
//               onChange={(e) => setType(e.target.value)}
//             >
//               <MenuItem value="categorize">Categorize</MenuItem>
//               <MenuItem value="cloze">Cloze</MenuItem>
//               <MenuItem value="comprehension">Comprehension</MenuItem>
//             </Select>
//           </FormControl>

//           <TextField
//             label="Question Text"
//             fullWidth
//             required
//             value={common.questionText}
//             onChange={(e) =>
//               setCommon({ ...common, questionText: e.target.value })
//             }
//           />
//           <Box className="flex gap-4">
//             <TextField
//               label="Points"
//               type="number"
//               sx={{ maxWidth: 140 }}
//               value={common.points}
//               onChange={(e) => setCommon({ ...common, points: e.target.value })}
//             />
//             <TextField
//               label="Instructions (optional)"
//               fullWidth
//               value={common.instructions}
//               onChange={(e) =>
//                 setCommon({ ...common, instructions: e.target.value })
//               }
//             />
//           </Box>

//           {TypeBody}
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button
//           variant="contained"
//           onClick={handleCreate}
//           disabled={!canSubmit()}
//         >
//           Create
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
