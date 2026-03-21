package com.ipl.auction.util;

import com.ipl.auction.dto.request.PlayerRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
@Slf4j
public class ExcelImportUtil {

    /**
     * Expected columns (0-indexed):
     * 0: playerName, 1: age, 2: role, 3: nativePlace, 4: currentAddress,
     * 5: teamRepresented, 6: dob (date), 7: phoneNumber, 8: basePrice
     */
    public List<PlayerRequest> parsePlayersFromExcel(MultipartFile file) throws IOException {
        List<PlayerRequest> players = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            int rowCount = 0;

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // skip header
                if (isRowEmpty(row)) continue;

                try {
                    PlayerRequest request = new PlayerRequest();
                    request.setPlayerName(getCellString(row, 0));
                    request.setAge((int) getCellNumeric(row, 1));
                    request.setRole(getCellString(row, 2));
                    request.setNativePlace(getCellString(row, 3));
                    request.setCurrentAddress(getCellString(row, 4));
                    request.setTeamRepresented(getCellString(row, 5));
                    request.setDob(getCellDate(row, 6));
                    request.setPhoneNumber(getCellString(row, 7));
                    request.setBasePrice(BigDecimal.valueOf(getCellNumeric(row, 8)));
                    players.add(request);
                    rowCount++;
                } catch (Exception e) {
                    log.warn("Skipping row {} due to error: {}", row.getRowNum(), e.getMessage());
                }
            }
            log.info("Parsed {} players from Excel", rowCount);
        }
        return players;
    }

    private String getCellString(Row row, int col) {
        Cell cell = row.getCell(col);
        if (cell == null) return null;
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            default -> null;
        };
    }

    private double getCellNumeric(Row row, int col) {
        Cell cell = row.getCell(col);
        if (cell == null) return 0;
        return cell.getCellType() == CellType.NUMERIC ? cell.getNumericCellValue() : 0;
    }

    private LocalDate getCellDate(Row row, int col) {
        Cell cell = row.getCell(col);
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            Date date = cell.getDateCellValue();
            return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }
        return null;
    }

    private boolean isRowEmpty(Row row) {
        for (Cell cell : row) {
            if (cell.getCellType() != CellType.BLANK) return false;
        }
        return true;
    }
}
