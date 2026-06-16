import { formatTime, formatVoltage } from '../utils/formatters.js';

function SwitchingTable({ switchingPoints }) {
  return (
    <div className="switching-table-wrap">
      <div className="table-heading">
        <h3>Anahtarlama Noktaları</h3>
        <span>{switchingPoints.length} geçiş</span>
      </div>

      {switchingPoints.length === 0 ? (
        <p className="empty-table">Seçilen aralıkta Vin sinyali Vref çizgisini kesmiyor.</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Zaman</th>
                <th>Vin</th>
                <th>Vref</th>
                <th>Geçiş yönü</th>
              </tr>
            </thead>
            <tbody>
              {switchingPoints.map((point) => (
                <tr key={`${point.no}-${point.time}`}>
                  <td>{point.no}</td>
                  <td>{formatTime(point.time)}</td>
                  <td>{formatVoltage(point.vin)}</td>
                  <td>{formatVoltage(point.vref)}</td>
                  <td>{point.direction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SwitchingTable;
