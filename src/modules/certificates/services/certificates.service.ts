import { api } from '../../../shared/config/api-client'
import type { CertificateSummary, CertificateDetail } from '../../../shared/types'

export const certificatesService = {
  getCertificates: () => api.get<CertificateSummary[]>('/certificates'),
  getCertificateDetail: (certId: string) => api.get<CertificateDetail>(`/certificates/${certId}`),
}
