package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Order;
import com.mycompany.myapp.repository.OrderRepository;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ExcelService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> importOrdersFromExcel(MultipartFile file) {
        List<Order> orders = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream(); Workbook workbook = WorkbookFactory.create(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Skip header row
                Order order = new Order();
                order.setId((long) getNumericCellValue(row.getCell(0)));
                order.setName(getStringCellValue(row.getCell(1)));
                order.setNumber((int) getNumericCellValue(row.getCell(2)));
                order.setStatus(getStringCellValue(row.getCell(3)));
                order.setType(getStringCellValue(row.getCell(4)));
                order.setPrice(getNumericCellValue(row.getCell(5)));
                order.setImportDate(getLocalDateCellValue(row.getCell(6)));
                order.setExportDate(getLocalDateCellValue(row.getCell(7)));
                orders.add(order);
                orderRepository.save(order);
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Handle exception
        }
        return orders;
    }

    public ResponseEntity<byte[]> exportOrdersToExcel() {
        List<Order> orders = orderRepository.findAll();

        String downloadFolder = "C:\\Users\\ADMIN\\Downloads";

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Orders");

            // Header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Name");
            headerRow.createCell(2).setCellValue("Number");
            headerRow.createCell(3).setCellValue("Status");
            headerRow.createCell(4).setCellValue("Type");
            headerRow.createCell(5).setCellValue("Price");
            headerRow.createCell(6).setCellValue("Import Date");
            headerRow.createCell(7).setCellValue("Export Date");

            // Data rows
            int rowNum = 1;
            for (Order order : orders) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(order.getId());
                row.createCell(1).setCellValue(order.getName());
                row.createCell(2).setCellValue(order.getNumber());
                row.createCell(3).setCellValue(order.getStatus());
                row.createCell(4).setCellValue(order.getType());
                row.createCell(5).setCellValue(order.getPrice());
                row.createCell(6).setCellValue(order.getImportDate().format(DateTimeFormatter.ISO_LOCAL_DATE));
                row.createCell(7).setCellValue(order.getExportDate().format(DateTimeFormatter.ISO_LOCAL_DATE));
            }

            // Tạo thư mục Download nếu chưa tồn tại
            Path downloadPath = Paths.get(downloadFolder);
            if (!Files.exists(downloadPath)) {
                Files.createDirectories(downloadPath);
            }

            // Lưu file Excel
            String filePath = downloadFolder + "\\orders.xlsx";
            try (FileOutputStream fileOut = new FileOutputStream(filePath)) {
                workbook.write(fileOut);
            }

            System.out.println("File exported successfully to: " + filePath);

            Path path = Paths.get(filePath);
            byte[] excelBytes = Files.readAllBytes(path);

            Files.deleteIfExists(path);

            return ResponseEntity.ok().header("Content-Disposition", "attachment; filename=orders.xlsx").body(excelBytes);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(("Export failed: " + e.getMessage()).getBytes());
        }
    }

    private String getStringCellValue(Cell cell) {
        return cell != null ? cell.getStringCellValue() : null;
    }

    private double getNumericCellValue(Cell cell) {
        return cell != null ? cell.getNumericCellValue() : 0;
    }

    private LocalDate getLocalDateCellValue(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC) {
            return cell.getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        } else {
            return LocalDate.parse(cell.getStringCellValue());
        }
    }
}
