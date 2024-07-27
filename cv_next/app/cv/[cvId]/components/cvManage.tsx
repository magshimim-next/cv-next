"use client";

import EditableLink from "./editables/editableLink";

export default function CvManage({ cv }: { cv: CvModel }) {
  return (
    <article
      key={cv.id}
      className={`mb-3 flex-col rounded-lg border-b border-gray-200 bg-white p-6 text-base dark:bg-theme-800`}
    >
      <footer className="flex-col items-center justify-between">
        <div className="flex-col items-center">
          <p className="inline-flex items-center text-lg font-medium text-gray-900 dark:text-white">
            CV Management
          </p>
          <EditableLink cv={cv} />
        </div>
      </footer>
      <span> </span>
    </article>
  );
}
