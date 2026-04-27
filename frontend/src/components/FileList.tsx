import type { FileRecord } from '../api/client'

type FileListProps = {
  files: FileRecord[]
  onDownload: (filename: string) => Promise<void>
}

function FileList({ files, onDownload }: FileListProps) {
  return (
    <div className="file-list">
      {files.map((file) => (
        <article key={file.id} className="file-card">
          <div>
            <h3>{file.original_name}</h3>
            <p>{file.content_type}</p>
            <p className="file-meta">Stored as {file.stored_name}</p>
          </div>
          <button className="secondary-button" type="button" onClick={() => void onDownload(file.stored_name)}>
            Download file
          </button>
        </article>
      ))}
    </div>
  )
}

export default FileList
