import { useEffect, useState } from 'react'

import { downloadFile, getFiles, type DemoUser, type FileRecord } from '../api/client'
import FileList from '../components/FileList'

type FilesPageProps = {
  currentUser: DemoUser
}

function FilesPage({ currentUser }: FilesPageProps) {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadFiles = async () => {
      try {
        const records = await getFiles()
        if (active) {
          setFiles(records)
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load files.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadFiles()

    return () => {
      active = false
    }
  }, [])

  const handleDownload = async (filename: string) => {
    setDownloadError(null)

    try {
      await downloadFile(filename)
    } catch (downloadFailure) {
      setDownloadError(
        downloadFailure instanceof Error ? downloadFailure.message : 'Unable to download file.',
      )
    }
  }

  return (
    <main className="page-shell files-shell">
      <section className="page-header-card">
        <div>
          <p className="eyebrow">Files</p>
          <h1>Fitness resources and reports</h1>
          <p className="page-copy">
            Browse the demo reports, shared templates, and classroom file resources currently
            visible to {currentUser.name}.
          </p>
        </div>
      </section>

      <section className="panel-card">
        <div className="section-heading-row">
          <h2>Available files</h2>
          <span className="feature-status">{files.length} items</span>
        </div>

        {loading ? <p className="status-message">Loading files...</p> : null}
        {error ? <p className="status-message status-error">{error}</p> : null}
        {downloadError ? <p className="status-message status-error">{downloadError}</p> : null}

        {!loading && !error && files.length === 0 ? (
          <p className="status-message">No files available right now.</p>
        ) : null}

        {!loading && !error && files.length > 0 ? (
          <FileList files={files} onDownload={handleDownload} />
        ) : null}
      </section>
    </main>
  )
}

export default FilesPage
