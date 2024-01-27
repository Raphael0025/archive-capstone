import { NewDocumentType } from '../types/document'

interface IProps{
    article: NewDocumentType
}
export default function TableRow ({article} : IProps) {

    return(
        <tr>
            <td className='border-slate-600 p-2'>
                {article.title}
            </td>
            <td className='border-slate-600 p-2'>
                {article.authors}
            </td>
            <td className='border-slate-600 p-2'>
                {article.resourceType}
            </td>
            <td className='border-slate-600 p-2'>
                {article.file}
            </td>
        </tr>
    )
}