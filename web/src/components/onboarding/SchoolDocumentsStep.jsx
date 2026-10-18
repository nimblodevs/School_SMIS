import { useState } from 'react';
import { FileCheck2, FileText, ShieldCheck, Trash2, Upload } from 'lucide-react';

const documentTypes = [
  {
    id: 'registrationCertificate',
    title: 'School registration certificate',
    description: 'Official certificate confirming the school is registered.',
    required: true,
    icon: FileCheck2,
  },
  {
    id: 'fireSafetyCertificate',
    title: 'Fire safety certificate',
    description: 'Current fire safety inspection or compliance certificate.',
    required: true,
    icon: ShieldCheck,
  },
  {
    id: 'publicHealthCertificate',
    title: 'Public health certificate',
    description: 'Optional public health inspection or compliance record.',
    icon: FileText,
  },
  {
    id: 'operatingLicence',
    title: 'Operating licence',
    description: 'Optional licence or approval to operate.',
    icon: FileText,
  },
  {
    id: 'otherSupportingDocument',
    title: 'Other supporting document',
    description: 'Add another document that supports your school registration.',
    icon: FileText,
  },
];

const allowedTypes = new Set(['application/pdf', 'image/png', 'image/jpeg']);
const maxFileSize = 10 * 1024 * 1024;

function formatFileSize(size) {
  return size < 1024 * 1024
    ? `${Math.max(1, Math.round(size / 1024))} KB`
    : `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function SchoolDocumentsStep({ documents, setDocuments, requiredError }) {
  const [fileErrors, setFileErrors] = useState({});

  const selectFile = (documentType, event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!allowedTypes.has(file.type)) {
      setFileErrors((errors) => ({
        ...errors,
        [documentType.id]: 'Use a PDF, PNG, or JPG file.',
      }));
      return;
    }
    if (file.size > maxFileSize) {
      setFileErrors((errors) => ({
        ...errors,
        [documentType.id]: 'Each document must be 10 MB or smaller.',
      }));
      return;
    }

    setFileErrors((errors) => ({ ...errors, [documentType.id]: '' }));
    setDocuments((current) => ({ ...current, [documentType.id]: file }));
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-forest/10 bg-mint/35 p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-forest">
            <ShieldCheck aria-hidden="true" className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-deep">Required for school verification</p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Upload the school registration and fire safety certificates to continue. Documents are securely stored with your school profile.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {documentTypes.map((documentType) => {
          const file = documents[documentType.id];
          const Icon = documentType.icon;
          const error = fileErrors[documentType.id];
          const inputId = `school-document-${documentType.id}`;

          return (
            <section
              key={documentType.id}
              className={`rounded-2xl border p-4 transition-colors sm:p-5 ${
                error ? 'border-error-border bg-error-soft/30' : 'border-line bg-white'
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-page text-forest">
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-deep">{documentType.title}</h3>
                    {documentType.required ? (
                      <span className="rounded-full bg-error-soft px-2 py-0.5 text-[10px] font-semibold text-error">
                        Required
                      </span>
                    ) : (
                      <span className="rounded-full bg-page px-2 py-0.5 text-[10px] font-medium text-muted">
                        Optional
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-muted">{documentType.description}</p>
                  {file ? (
                    <p className="mt-2 truncate text-xs font-medium text-forest">
                      {file.name} · {formatFileSize(file.size)}
                    </p>
                  ) : null}
                  {error ? (
                    <p role="alert" className="mt-2 text-xs font-medium text-error">{error}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                  <label
                    htmlFor={inputId}
                    className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-forest transition hover:border-mint-strong hover:bg-mint/40 focus-within:ring-2 focus-within:ring-forest"
                  >
                    <Upload aria-hidden="true" className="size-3.5" />
                    {file ? 'Replace' : 'Choose file'}
                  </label>
                  {file ? (
                    <button
                      type="button"
                      aria-label={`Remove ${documentType.title}`}
                      onClick={() => {
                        setDocuments((current) => ({
                          ...current,
                          [documentType.id]: undefined,
                        }));
                        setFileErrors((errors) => ({ ...errors, [documentType.id]: '' }));
                      }}
                      className="grid size-9 place-items-center rounded-xl text-muted transition hover:bg-error-soft hover:text-error focus-visible:ring-2 focus-visible:ring-error focus-visible:outline-none"
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </button>
                  ) : null}
                  <input
                    id={inputId}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                    onChange={(event) => selectFile(documentType, event)}
                    className="sr-only"
                  />
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {requiredError ? (
        <p role="alert" className="rounded-xl border border-error-border bg-error-soft px-4 py-3 text-sm font-medium text-error">
          {requiredError}
        </p>
      ) : null}
      <p className="text-xs leading-5 text-muted">
        Accepted formats: PDF, PNG, JPG · Maximum size: 10 MB per document.
      </p>
    </div>
  );
}
